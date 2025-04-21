const express = require('express');
const router = express.Router();
const { login, me } = require('../controllers/auth-controller');

// POST /auth/login - Login 
router.post('/login', login);

// GET /auth/me - Get current user
router.get('/me', me);

module.exports = router; 