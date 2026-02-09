const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { isLoggedIn } = require('../middleware/auth');

router.post('/add', isLoggedIn, async (req, res) => {
    const { itemId, qty } = req.body;

    if (!req.session.cart) {
        req.session.cart = {
            items: {},
            totalQty: 0,
            totalPrice: 0
        };
    }

    const cart = req.session.cart;
    const item = await Item.findById(itemId);

    if (!item) {
        return res.status(404).json({ success: false });
    }

    if (!cart.items[itemId]) {
        cart.items[itemId] = {
            _id: item._id,
            name: item.name,
            price: item.price,
            img: item.img,
            quantity: 0
        };
    }

    cart.items[itemId].quantity += qty;
    cart.totalQty += qty;
    cart.totalPrice += item.price * qty;

    if (cart.items[itemId].quantity <= 0) {
        delete cart.items[itemId];
    }

    res.json({ success: true, cart });
});

module.exports = router;
