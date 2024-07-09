const express = require('express');
const router = express.Router();
const { signup, login, test } = require('../controllers/authController');

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Test route
router.get('/test', test);

module.exports = router;
