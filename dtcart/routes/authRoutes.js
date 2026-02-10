const express = require('express');
const router = express.Router();

const {
    login,
    verifyOtp,
    logout,
    getLoginPage,
    saveName,
} = require('../controller/authController');



const { ifLoggedIn,isAuthenticated } = require('../middleware/auth');



router.get('/login', ifLoggedIn, getLoginPage);

router.post('/login', login);
router.post('/login/verify', verifyOtp);
router.post('/save-name', isAuthenticated, saveName);


router.get('/logout', logout);

module.exports = router;
