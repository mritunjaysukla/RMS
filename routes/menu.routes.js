const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');
const menuController = require('../controllers/menu.controller');

const router = express.Router();

/**
 * @openapi
 * /menus:
 *   get:
 *     tags: [Menu]
 *     summary: Get all menus
 *     description: Fetches a list of all menus with optional filters for category or availability. Accessible to all users (no authentication required).
 *     parameters:
 *       - name: categoryId
 *         in: query
 *         description: Filter by food category ID
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: isAvailable
 *         in: query
 *         description: Filter by availability status
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       200:
 *         description: Menus fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/menus', menuController.getMenus);

/**
 * @openapi
 * /menus:
 *   post:
 *     tags: [Menu]
 *     summary: Create a new menu with items
 *     description: Creates a new menu with associated items. Requires Manager role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, categoryId, items]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Lunch Special
 *               description:
 *                 type: string
 *                 example: A special lunch menu
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [name, description, price]
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Grilled Salmon
 *                     description:
 *                       type: string
 *                       example: Fresh salmon with herbs
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 24.99
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       201:
 *         description: Menu created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       400:
 *         description: Invalid input or category not found
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
router.post('/menus', auth(['Manager']), validateRole, menuController.createMenuWithItems);

/**
 * @openapi
 * /menus/{id}:
 *   patch:
 *     tags: [Menu]
 *     summary: Update a menu
 *     description: Updates the details of a specific menu. Requires Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Menu ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Lunch Special Updated
 *               description:
 *                 type: string
 *                 example: Updated lunch menu description
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       400:
 *         description: Invalid input or category not found
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
 *         description: Menu not found
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
router.patch('/menus/:id', auth(['Admin']), validateRole, menuController.updateMenu);

/**
 * @openapi
 * /menus/{id}/status:
 *   put:
 *     tags: [Menu]
 *     summary: Update menu status
 *     description: Updates the availability status of a menu. Requires Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Menu ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isAvailable]
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Menu status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       400:
 *         description: Invalid input
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
 *         description: Menu not found
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
router.put('/menus/:id/status', auth(['Admin']), validateRole, menuController.updateMenuStatus);

/**
 * @openapi
 * /menus/{id}:
 *   delete:
 *     tags: [Menu]
 *     summary: Delete a menu
 *     description: Deletes a specific menu by ID. Requires Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Menu ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Menu deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu deleted successfully
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
 *         description: Menu not found
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
router.delete('/menus/:id', auth(['Admin']), validateRole, menuController.deleteMenu);

module.exports = router;