const express = require('express');
const { createUser } = require('../controllers/admin.controller');
const { auth, authorize } = require('../middlewares/auth.Middleware');
const validateRole = require('../middlewares/role.Middleware');
const authController = require('../controllers/auth.Controller');

const router = express.Router();
// router.use(auth); // Apply authentication to all routes
// router.use(authorize(['ADMIN', 'MANAGER'])); // Allow both ADMIN and MANAGER roles

router.post(
  '/createUser',
  auth,
  authorize,
  validateRole(['ADMIN']),
  createUser
);
router.post('/register', authController.register);
router.post('/login', authController.loginUser);
router.delete('/users/:id', authController.deleteUser);

module.exports = router;
