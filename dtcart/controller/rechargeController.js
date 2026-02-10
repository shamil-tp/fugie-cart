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
        const { amount, transactionid } = req.body;
        
        await Recharge.create({
            id: Date.now().toString(),
            user: req.user._id,
            userName: req.user.name,
            amount,
            transactionid,
            text: `Recharge request for ₹${amount}`
        });

        // Redirect back to payment page to show the new history item
        return res.redirect('/recharge');
    } catch (error) {
        console.error(error);
        return res.redirect('/recharge'); // Simple error handling for now
    }
};
