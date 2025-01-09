const express = require('express');
const auth = require('../middlewares/auth.Middleware');
const validateRole = require('../middlewares/role.Middleware');
const {
  addMenuItem,
  approveMenuItem
} = require('../controllers/menu.Controller');

const router = express.Router();

// Route to add a menu item (accessible to ADMIN and MANAGER)
router.post('/menu', auth, validateRole(['ADMIN', 'MANAGER']), addMenuItem);

// Approve Menu Item Route
router.patch(
  '/menu/approve/:id',
  auth,
  validateRole(['ADMIN']),
  approveMenuItem
);

module.exports = router;
