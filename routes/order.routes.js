const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrdersByTable,
  updateOrderStatus,
  getOrders,
  handlePayment
} = require('../controllers/order.controller');
const validateRole = require('../middlewares/role.middleware');
const { auth, authorize } = require('../middlewares/auth.middleware');

router.get('/orders', auth, authorize, validateRole(['MANAGER']), getOrders);
router.post(
  '/payment',
  auth,
  authorize,
  validateRole(['MANAGER']),
  handlePayment
);
router.post('/orders', validateRole(['WAITER']), createOrder);
router.get('/orders/table/:tableId', getOrdersByTable);
router.patch('/orders/:orderId', updateOrderStatus);

module.exports = router;
