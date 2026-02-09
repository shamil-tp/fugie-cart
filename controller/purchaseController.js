const Purchase = require('../models/Purchase');

exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find();
        res.status(200).json({
            success: true,
            purchases
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createPurchase = async (req, res) => {
    try {
        const purchase = await Purchase.create(req.body);
        res.status(201).json({
            success: true,
            purchase
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
