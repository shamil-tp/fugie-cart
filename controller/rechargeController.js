const Recharge = require('../models/Recharge');

exports.getAllRecharges = async (req, res) => {
    try {
        const recharges = await Recharge.find();
        res.status(200).json({
            success: true,
            recharges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createRecharge = async (req, res) => {
    try {
        const recharge = await Recharge.create(req.body);
        res.status(201).json({
            success: true,
            recharge
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
