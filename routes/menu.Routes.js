const express = require('express');
const { auth } = require('../middlewares/auth.Middleware');
const validateRole = require('../middlewares/role.Middleware');
const {
  createMenuItem,
  getAllMenuItems,
  updateMenuItem,
  deleteMenuItem,
  approveMenuItem
} = require('../controllers/menu.Controller');

const router = express.Router();

// Route to add a menu item (accessible to ADMIN and MANAGER)
router.post('/menu', auth, validateRole(['ADMIN', 'MANAGER']), createMenuItem);

// Route to get all menu items (accessible to all authenticated users)
router.get(
  '/menu',
  validateRole(['ADMIN', 'MANAGER', 'WAITER']),
  getAllMenuItems
);

// Route to update a menu item (accessible to ADMIN and MANAGER)
router.put(
  '/menu/:id',
  auth,
  validateRole(['ADMIN', 'MANAGER']),
  updateMenuItem
);

// Route to delete a menu item (accessible to ADMIN)
router.delete('/menu/:id', auth, validateRole(['ADMIN']), deleteMenuItem);

// Approve Menu Item (accessible to ADMIN)
router.patch(
  '/menu/approve/:id',
  auth,
  validateRole(['ADMIN']),
  approveMenuItem
);

module.exports = router;
