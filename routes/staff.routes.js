const express = require('express');
const staffController = require('../controllers/staff.controller');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * @openapi
 * /staff:
 *   get:
 *     tags: [Staff]
 *     summary: Get all staff members
 *     description: Fetches a list of all staff members. Requires Admin or Manager role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff members fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StaffOnDuty'
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
router.get('/staff', auth(['Admin', 'Manager']), validateRole, staffController.getAllStaff);

/**
 * @openapi
 * /staff/on-duty:
 *   get:
 *     tags: [Staff]
 *     summary: Get staff on duty
 *     description: Fetches a list of staff members currently on duty with optional filters. Requires Manager or Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: role
 *         in: query
 *         description: Filter by staff role
 *         schema:
 *           $ref: '#/components/schemas/Role'
 *       - name: status
 *         in: query
 *         description: Filter by staff status
 *         schema:
 *           $ref: '#/components/schemas/StaffStatus'
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
 *     responses:
 *       200:
 *         description: Staff on duty fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StaffOnDuty'
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
router.get('/staffOnDuty', auth(['Admin', 'Manager']), validateRole, staffController.getStaffOnDuty);

/**
 * @openapi
 * /staff/{id}:
 *   delete:
 *     tags: [Staff]
 *     summary: Delete a staff member
 *     description: Deletes a staff member by ID. Requires Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Staff member ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Staff member deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff member deleted successfully
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
 *         description: Staff member not found
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
router.delete('/staff/:id', auth(['Admin']), validateRole, staffController.deleteStaff);

module.exports = router;