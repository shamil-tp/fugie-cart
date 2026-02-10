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
        return res.status(404).json({ success: false, message: "Item not found" });
    }

    // 🛑 Stock Validation
    const currentQtyInCart = cart.items[itemId]?.quantity || 0;
    if (qty > 0 && currentQtyInCart + qty > item.quantity) {
        return res.status(400).json({ 
            success: false, 
            message: `Only ${item.quantity} items in stock.`,
            available: item.quantity
        });
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

    // 💾 Save session explicitly to prevent race conditions during rapid clicks
    req.session.save((err) => {
        if (err) {
            console.error("Session Save Error:", err);
            return res.status(500).json({ success: false, message: "Error saving cart" });
        }
        res.json({ success: true, cart });
    });
});

module.exports = router;
