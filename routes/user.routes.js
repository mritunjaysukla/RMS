const express = require('express');

const userController = require('../controllers/user.controller');

const router = express.Router();
// router.use(auth); // Apply authentication to all routes
// router.use(authorize(['ADMIN', 'MANAGER'])); // Allow both ADMIN and MANAGER roles

router.post('/login', userController.loginUser);

router.post('/register', userController.register);

module.exports = router;
