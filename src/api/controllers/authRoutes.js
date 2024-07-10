const express = require('express');
const { signup, login } = require('./authController');
const router = express.Router();

// Route for user signup
router.post('/signup', signup);
router.post('/login', login);



// // Test route
// router.get('/test', test);

module.exports = router;
