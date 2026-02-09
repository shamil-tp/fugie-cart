const express = require('express');
const router = express.Router();
const { login, verifyOtp, logout, getLoginPage } = require('../controller/authController');
const { ifLoggedIn } = require('../middleware/auth');

router.get('/login', ifLoggedIn, getLoginPage);
router.post('/login', login);
router.post('/login/verify', verifyOtp);
router.get('/logout', logout);

module.exports = router;
