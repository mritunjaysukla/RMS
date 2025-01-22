const express = require('express');
const { createUser } = require('../controllers/admin.controller');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();
// router.use(auth); // Apply authentication to all routes
// router.use(authorize(['ADMIN', 'MANAGER'])); // Allow both ADMIN and MANAGER roles

router.post('/createUser', auth, validateRole(['ADMIN']), createUser);

router.post('/login', authController.loginUser);

router.post('/register', authController.register);

router.delete('/users/:id', authController.deleteUser);

module.exports = router;
