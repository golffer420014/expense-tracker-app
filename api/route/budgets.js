const express = require('express');
const router = express.Router();
const { create, getAll } = require('../controllers/budgets-controller');
// const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all budget routes
// router.use(authMiddleware);

// POST route to create a new budget
router.post('/create', create);

// GET route to get all budgets for a user
router.get('/get-all', getAll);

module.exports = router; 