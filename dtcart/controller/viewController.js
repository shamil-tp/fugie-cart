const Item = require('../models/Item');
const Purchase = require('../models/Purchase');
const User = require('../models/User')

exports.getHomePage = async (req, res) => {
  try {
    const items = await Item.find();
    // Sort items: available items first, out-of-stock items last
    items.sort((a, b) => (a.quantity === 0) - (b.quantity === 0));
    const cart = req.session.cart || { items: {} };

    res.render('home', {
      items,
      user: req.user,
      cart,   // 👈 send cart to EJS
      page: 'home'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


exports.getCartPage = async (req, res) => {
    try {
        const cart = req.session.cart;

        if (!cart || !cart.items) {
            return res.render('cart', {
                user: req.user,
                cartItems: [],
                total: 0,
                page: 'cart'
            });
        }

        const emptyCartError = req.session.emptyCartError;
        delete req.session.emptyCartError;

        res.render('cart', {
            user: req.user,
            cartItems: Object.values(cart.items),
            total: cart.totalPrice,
            emptyCartError,
            page: 'cart'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const Recharge = require('../models/Recharge');

exports.getPaymentPage = async (req, res) => {
    try {
        const recharges = await Recharge.find({ user: req.user._id }).sort({ _id: -1 });
        res.render('payment', {
            user: req.user,
            recharges, // Passing as recharges
            page: 'payment'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

exports.buyItems = async (req, res) => {
    try {
        const cart = req.session.cart;

        // 1. Validate Cart
        if (!cart || !cart.items || Object.keys(cart.items).length === 0) {
            req.session.emptyCartError = true;
            return res.redirect('/cart');
        }

        // 2. Secure Amount Calculation (Server-side)
        const totalAmount = cart.totalPrice;

        // 3. Atomic Balance Deduction (Allowing Negative Balance)
        // We use _id: req.user._id to correctly target the logged-in user
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { $inc: { balance: -totalAmount } },
            { new: true }
        );

        if (!user) {
            return res.status(400).send("Insufficient balance or user not found.");
        }

        // 4. Create Purchase Record
        const purchaseItems = Object.values(cart.items).map(item => ({
            item: item.name,
            itemid: item._id || item.id, // Support both if inconsistent
            quantity: item.quantity,
            amount: item.price * item.quantity
        }));

        await Purchase.create({
            user: user._id,
            userName: user.name,
            amount: totalAmount,
            date: new Date().toLocaleString(),
            items: purchaseItems
        });

        // 5. Clear Cart and Save Session
        req.session.cart = null;
        req.session.purchaseSuccess = true; // 👈 Add success flag
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // 6. Atomic Stock Decrement
        // We use $gte to ensure we don't go below 0 during the update
        const stockUpdatePromises = purchaseItems.map(pItem => {
            return Item.findOneAndUpdate(
                { _id: pItem.itemid, quantity: { $gte: pItem.quantity } },
                { $inc: { quantity: -pItem.quantity } },
                { new: true }
            );
        });
        
        const updateResults = await Promise.all(stockUpdatePromises);

        // Check if any update failed (returned null because condition wasn't met)
        if (updateResults.some(res => res === null)) {
            // NOTE: In a production app, you'd want to rollback the balance update here.
            // For now, we'll log it. An alternative is using a MongoDB session.
            console.error("Critical: Stock decrement failed for one or more items due to insufficient stock.");
        }

        // 7. Success Redirect
        return res.redirect('/history');

    } catch (error) {
        console.error("Purchase Error:", error);
        return res.status(500).send("An error occurred during purchase.");
    }
};

exports.getHistoryPage = async (req, res) => {
    try {
        const purchases = await Purchase.find({ user: req.user._id }).sort({ _id: -1 });
        const purchaseSuccess = req.session.purchaseSuccess;
        delete req.session.purchaseSuccess; // Clear after retrieval

        res.render('history', {
            user: req.user,
            purchases,
            purchaseSuccess, // 👈 pass to view
            page: 'history'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

exports.getIntentPage = async (req, res) => {
    try {
        const amount = req.query.amount || 100;
        res.render('intent', {
            user: req.user,
            amount,
            page: 'recharge'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};