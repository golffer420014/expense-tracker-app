const express = require('express');
const router = express.Router();
const { create, getAll, getById, updateByID, remove } = require('../controllers/categories-controller');
// const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all category routes
// router.use(authMiddleware);

router.post('/create', create);
router.get('/get-all', getAll);
router.get('/get-by-id/:id', getById);
router.post('/update-category/:id', updateByID);
router.post('/remove-category/:id', remove);

module.exports = router; 