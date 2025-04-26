const express = require('express');
const router = express.Router();
const { create, getAll, getById, update, remove, getUserMonthlySummary } = require('../controllers/transactions-controller');
// const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all transaction routes
// router.use(authMiddleware);

// POST /transactions - Create a new transaction
router.post('/create', create);

// GET /transactions - Get all transactions with optional filters
router.get('/get-all', getAll);

// GET /transactions/:id - Get a specific transaction by ID
router.get('/get-by-id/:id', getById);

// PUT /transactions/:id - Update a transaction
router.put('/update-transaction/:id', update);

// DELETE /transactions/:id - Delete a transaction
router.delete('/remove-transaction/:id', remove);

router.post('/get-user-monthly-summary', getUserMonthlySummary);

module.exports = router; 