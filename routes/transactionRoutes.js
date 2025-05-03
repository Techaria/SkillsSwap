const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

// Handle Skill Exchange (Transaction)
router.post('/exchange', TransactionController.handleTransaction);

// View Transaction History
router.get('/transactions', TransactionController.viewTransactions);

module.exports = router;
