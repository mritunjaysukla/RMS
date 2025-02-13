const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');

// Create Order (Waiter only)
router.post(
  '/orders',
  auth(['Waiter']),
  validateRole,
  orderController.createOrder
);

// Get Orders with Filters (Admin/Manager)
router.get(
  '/orders',
  auth(['Admin', 'Manager']),
  validateRole,
  orderController.getOrders
);

// Get Order Details (Anyone can access)
router.get(
  '/orders/:id',
  auth(),
  validateRole,
  orderController.getOrderDetails
);

// Update Order Status (Admin/Manager)
router.patch(
  '/orders/:id/status',
  auth(['Admin', 'Manager']),
  validateRole,
  orderController.updateOrderStatus
);

module.exports = router;
