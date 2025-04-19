const express = require('express');
const router = express.Router();
const { register, getAll, getByID, updateUser } = require('../controllers/user-controller');


// POST /users - Create a new user
router.post('/register', register);
router.get('/get-all', getAll);
router.get('/get-by-id/:id', getByID);
router.post('/update-user/:id', updateUser);

module.exports = router;
