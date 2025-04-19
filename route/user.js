const express = require('express');
const router = express.Router();
const { register } = require('../controllers/user-controller');


// POST /users - Create a new user
router.post('/register', register);

module.exports = router;
