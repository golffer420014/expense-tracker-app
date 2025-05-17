const express = require('express');
const router = express.Router();
const { getYearlySummary, getExpenseBudgetSummary } = require('../controllers/reports-controller');

router.get('/get-yearly-summary', getYearlySummary);
router.get('/get-expense-budget-summary', getExpenseBudgetSummary);

module.exports = router;

