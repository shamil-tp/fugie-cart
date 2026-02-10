const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const itemController = require('../controller/itemController');
const purchaseController = require('../controller/purchaseController');
const rechargeController = require('../controller/rechargeController');
const requestController = require('../controller/requestController');
const viewController = require('../controller/viewController');
const cartRoutes = require('./cartRoutes');


const { isLoggedIn } = require('../middleware/auth');

// View Routes
router.get('/', isLoggedIn, viewController.getHomePage);
router.get('/cart', isLoggedIn, viewController.getCartPage);
router.post('/cart', isLoggedIn, viewController.buyItems);
router.get('/recharge', isLoggedIn, viewController.getPaymentPage);

// Auth Routes
router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);


// Item Routes
router.get('/items', isLoggedIn, itemController.getAllItems);
router.post('/items', isLoggedIn, itemController.createItem);
router.get('/items/request',isLoggedIn, (req, res) => {
    return res.render('request-item',{msg:''});
});
router.post('/items/request',isLoggedIn,itemController.requestItem)



// Purchase Routes
router.get('/purchases', isLoggedIn, purchaseController.getAllPurchases);
router.post('/purchases', isLoggedIn, purchaseController.createPurchase);

// Recharge Routes
router.get('/recharges', isLoggedIn, rechargeController.getAllRecharges);
router.post('/recharges', isLoggedIn, rechargeController.createRecharge);

// Request Routes
router.get('/requests', isLoggedIn, requestController.getAllRequests);
router.post('/requests', isLoggedIn, requestController.createRequest);

module.exports = router;
