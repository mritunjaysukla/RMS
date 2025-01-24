const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/users', auth, validateRole(['ADMIN']), authController.createUser);

router.get(
  '/users',
  auth,
  validateRole(['ADMIN', 'MANAGER']),
  authController.getUsers
);

router.get(
  '/users/:id',
  auth,
  validateRole(['ADMIN', 'MANAGER']),
  authController.getUserById
);

router.put(
  '/users/:id',
  auth,
  validateRole(['ADMIN']),
  authController.updateUser
);

router.delete(
  '/users/:id',
  auth,
  validateRole(['ADMIN']),
  authController.deleteUser
);

module.exports = router;
