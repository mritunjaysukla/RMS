const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// User Authentication Routes
router.post('/register', userController.register);
router.post('/login', userController.loginUser);

// Forgot & Reset Password Routes
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/logout', userController.logout);
module.exports = router;
