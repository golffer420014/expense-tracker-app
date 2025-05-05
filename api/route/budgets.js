const express = require('express');
const router = express.Router();
const { create, getAll, update, remove } = require('../controllers/budgets-controller');
// const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all budget routes
// router.use(authMiddleware);

// POST route to create a new budget
router.post('/create', create);

// GET route to get all budgets for a user
router.get('/get-all', getAll);

// PUT route to update a budget
router.put('/update-budget/:id', update);

// DELETE route to delete a budget
router.delete('/remove-budget/:id', remove);

module.exports = router; 