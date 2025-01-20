const express = require('express');
const { createUser } = require('../controllers/admin.controller');
const { auth, authorize } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();
// router.use(auth); // Apply authentication to all routes
// router.use(authorize(['ADMIN', 'MANAGER'])); // Allow both ADMIN and MANAGER roles

/**
 * @swagger
 * /auth/createUser:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MANAGER, WAITER]
 *             required: [username, password, role]
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Unauthorized
 */

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
