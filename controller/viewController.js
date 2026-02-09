const Item = require('../models/Item');
const Purchase = require('../models/Purchase');

exports.getHomePage = async (req, res) => {
    try {
        const items = await Item.find();
        res.render('home', {
            items,
            user: req.user,
            page: 'home'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

exports.getCartPage = async (req, res) => {
    try {
        // Find latest purchase for user that might be considered "cart"
        // Since we don't have a distinct status, we'll try to find one or just return empty
        // For demonstration, let's look for a purchase with no 'accepted' flag or similar if it existed?
        // But Purchase model doesn't have status in the file I saw (User, userName, amount, items). 
        // Recharge has 'accepted'. Purchase doesn't.
        // Let's just return an empty array for now to prevent errors, 
        // or if we want to show something, I'd need to create one.
        // I'll stick to empty but correctly formatted so EJS doesn't crash.
        
        const cartItems = []; 
        const total = 0;

        res.render('cart', {
            user: req.user,
            cartItems,
            total,
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
            page: 'recharge'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
