const Item = require('../models/Item');

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json({
            success: true,
            items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createItem = async (req, res) => {
    try {
        const item = await Item.create(req.body);
        res.status(201).json({
            success: true,
            item
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
