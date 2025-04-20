const express = require('express');
const router = express.Router();
const { createTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction } = require('../controllers/transactions-controller');
// const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all transaction routes
// router.use(authMiddleware);

// POST /transactions - Create a new transaction
router.post('/', createTransaction);

// GET /transactions - Get all transactions with optional filters
router.get('/', getAllTransactions);

// GET /transactions/:id - Get a specific transaction by ID
router.get('/:id', getTransactionById);

// PUT /transactions/:id - Update a transaction
router.put('/:id', updateTransaction);

// DELETE /transactions/:id - Delete a transaction
router.delete('/:id', deleteTransaction);

module.exports = router; 