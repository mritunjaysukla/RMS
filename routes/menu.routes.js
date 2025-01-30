const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');
const menuController = require('../controllers/menu.controller');

const router = express.Router();
// Manager routes
router.post(
  '/menus',
  auth,
  validateRole['Manager'],
  menuController.createMenuWithItems
);

// Admin routes
router.get(
  '/menus/pending',
  auth,
  validateRole('Admin'),
  menuController.getPendingMenus
);
router.get(
  '/menus/rejected',
  auth,
  validateRole('Admin'),
  menuController.getRejectedMenus
);
router.patch(
  '/menus/:id/status',
  auth,
  validateRole('Admin'),
  menuController.approveOrRejectMenu
);
router.patch(
  '/menus/:id/approve',
  auth,
  validateRole('Admin'),
  menuController.approveMenu
);

// Public routes
router.get('/menus/active', menuController.getActiveMenus);
router.get('/menus/popular', menuController.getPopular);
router.get(
  '/menus/category/:categoryId',
  menuController.getMenusByFoodCategory
);
module.exports = router;
