const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/users', auth, validateRole(['ADMIN']), userController.createUser);

router.get(
  '/users',
  auth,
  validateRole(['ADMIN', 'MANAGER']),
  userController.getUsers
);

router.get(
  '/users/:id',
  auth,
  validateRole(['ADMIN', 'MANAGER']),
  userController.getUserById
);

router.put(
  '/users/:id',
  auth,
  validateRole(['ADMIN']),
  userController.updateUser
);

router.delete(
  '/users/:id',
  auth,
  validateRole(['ADMIN']),
  userController.deleteUser
);

module.exports = router;
