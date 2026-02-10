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
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);     
            if (req.user.name) {
                return res.redirect('/');
            }else{
                return res.redirect('/auth/save-name');
            }
        } catch (e) {
            return next();
        }
    }
    next();
};

exports.isAuthenticated = async (req, res, next) => {
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
