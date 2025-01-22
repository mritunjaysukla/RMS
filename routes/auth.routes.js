const express = require('express');
const { createUser } = require('../controllers/admin.controller');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();
// router.use(auth); // Apply authentication to all routes
// router.use(authorize(['ADMIN', 'MANAGER'])); // Allow both ADMIN and MANAGER roles

// @swagger.tags = ['Auth']
/**
 * This allows you to pass in a json object and get a json object response back
 * this is also an example of a post request
 * @route POST /api/post/body
 * @param {Sprite.model} sprite.body.required - Sprite description
 * @group Post - POST API
 * @returns {Error}  default - Unexpected error
 */
router.post('/createUser', auth, validateRole(['ADMIN']), createUser);
// #swagger.tags = ['Auth']
router.post('/login', authController.loginUser);

// #swagger.tags = ['Auth']
router.post('/register', authController.register);

router.delete('/users/:id', authController.deleteUser);

module.exports = router;
