const express = require('express');
const router = express.Router();
const { getDashboard, getRequests, getUsers, getPayments, getRecharges } = require('../controllers/dashboradController');

router.get('/', getDashboard);
router.get('/requests', getRequests);
router.get('/users', getUsers);
router.get('/payments', getPayments);
router.get('/recharges', getRecharges);

module.exports = router;    