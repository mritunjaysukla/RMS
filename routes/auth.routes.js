const express = require('express');

const authController = require('../controllers/auth.controller');

const router = express.Router();
// router.use(auth); // Apply authentication to all routes
// router.use(authorize(['ADMIN', 'MANAGER'])); // Allow both ADMIN and MANAGER roles

router.post('/login', authController.loginUser);

router.post('/register', authController.register);

module.exports = router;
