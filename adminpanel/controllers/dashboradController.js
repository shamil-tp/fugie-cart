const Item = require('../models/item');
const User = require('../models/user');
const Payment = require('../models/payment');
const Recharge = require('../models/recharge');
const Request = require('../models/request');

exports.getDashboard = async (req, res) => {
    try {
        const items = await Item.find();
        res.render('dashboard', { items,page:'dashboard' });
    } catch (error) {
        res.status(500).send('Error fetching items');
    }
};

exports.getAddItems = async (req, res) => {
    try {
        res.render('additems', { page: 'additems' });
    } catch (error) {
        res.status(500).send('Error fetching additems');
    }
};

exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.render('requests', { requests,page:'requests' });
    } catch (error) {
        res.status(500).send('Error fetching requests');
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users,page:'users' });
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.render('payments', { payments,page:'payments' });
    } catch (error) {
        res.status(500).send('Error fetching payments');
    }
};

exports.getRecharges = async (req, res) => {
    try {
        const recharges = await Recharge.find();
        res.render('recharges', { recharges,page:'recharges' });
    } catch (error) {
        res.status(500).send('Error fetching recharges');
    }
};
