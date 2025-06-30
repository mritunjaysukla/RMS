const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Order]
 *     summary: Create a new order
 *     description: Creates a new order with items. Requires Waiter role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tableId, items]
 *             properties:
 *               tableId:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [menuItemId, quantity]
 *                   properties:
 *                     menuItemId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               specialInstructions:
 *                 type: string
 *                 example: No onions
 *                 nullable: true
 *               discount:
 *                 type: number
 *                 format: float
 *                 example: 10.0
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input or menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden: Insufficient role permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/orders', auth(['Waiter']), validateRole, orderController.createOrder);

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Order]
 *     summary: Get all orders with filters
 *     description: Fetches orders with optional filters for status, date range, or waiter. Requires Manager or Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         description: Filter by order status
 *         schema:
 *           $ref: '#/components/schemas/OrderStatus'
 *       - name: startDate
 *         in: query
 *         description: Filter by start date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-06-01
 *       - name: endDate
 *         in: query
 *         description: Filter by end date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-06-30
 *       - name: waiterId
 *         in: query
 *         description: Filter by waiter ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden: Insufficient role permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/orders', auth(['Admin', 'Manager']), validateRole, orderController.getOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Order]
 *     summary: Get order details
 *     description: Fetches details of a specific order by ID. Accessible to authenticated users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/orders/:id', auth(), validateRole, orderController.getOrderDetails);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     tags: [Order]
 *     summary: Update order status
 *     description: Updates the status of an order (e.g., Preparing, Served, Rejected). Requires Manager or Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 $ref: '#/components/schemas/OrderStatus'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden: Insufficient role permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/orders/:id/status', auth(['Admin', 'Manager']), validateRole, orderController.updateOrderStatus);

module.exports = router;