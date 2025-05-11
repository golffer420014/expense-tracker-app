const express = require('express');
const router = express.Router();
const { getYearlySummary } = require('../controllers/reports-controller');

router.get('/get-yearly-summary', getYearlySummary);


module.exports = router;

