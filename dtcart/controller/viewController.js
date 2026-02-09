const Item = require('../models/Item');
const Purchase = require('../models/Purchase');
const User = require('../models/User')

exports.getHomePage = async (req, res) => {
  try {
    const items = await Item.find();
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

        res.render('cart', {
            user: req.user,
            cartItems: Object.values(cart.items),
            total: cart.totalPrice,
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

exports.buyItems = async(req,res)=>{
    try{
const amount = Number(req.body.amount);

if (isNaN(amount)) {
    return res.status(400).send("Invalid amount");
}
        const user = await User.findOne({id:req.user.id})
        user.balance -= amount
await user.save();
        const items = await Item.find();
req.session.cart = null;
const cart = {items:{}}
    return res.render('home', {
      items,
      user: user,
      cart,   // 👈 send cart to EJS
      page: 'home'
    });
    }catch(error){
        return res.send(error)
    }
}