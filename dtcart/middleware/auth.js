const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isLoggedIn = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.redirect('/auth/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.redirect('/auth/login');
    }
};

exports.ifLoggedIn = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        try {
             // Verify token validity even here
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // If valid, redirect home
            return res.redirect('/');
        } catch (e) {
            // If invalid, proceed to login page
            return next();
        }
    }
    next();
};
