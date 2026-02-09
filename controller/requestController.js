const Request = require('../models/Request');

exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createRequest = async (req, res) => {
    try {
        const request = await Request.create(req.body);
        res.status(201).json({
            success: true,
            request
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
