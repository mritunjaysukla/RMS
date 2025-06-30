const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');

/**
 * @openapi
 * /reports:
 *   post:
 *     tags: [Report]
 *     summary: Generate a new report
 *     description: Generates a report for a specific period. Requires Manager role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [period, submittedToId]
 *             properties:
 *               period:
 *                 $ref: '#/components/schemas/ReportPeriod'
 *               submittedToId:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the admin to whom the report is submitted
 *     responses:
 *       201:
 *         description: Report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
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
 *         description: Admin not found
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
router.post('/reports', auth(['Manager']), validateRole, reportController.generateReport);

/**
 * @openapi
 * /reports:
 *   get:
 *     tags: [Report]
 *     summary: Get all reports
 *     description: Fetches a list of all reports. Requires Admin role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
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
router.get('/reports', auth(['Admin']), validateRole, reportController.getAllReports);

/**
 * @openapi
 * /reports/{id}:
 *   get:
 *     tags: [Report]
 *     summary: Get report details
 *     description: Fetches detailed information about a specific report, including table-wise and order-wise breakdowns. Requires Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Report ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Report details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 period:
 *                   $ref: '#/components/schemas/ReportPeriod'
 *                 totalOrders:
 *                   type: integer
 *                   example: 100
 *                 totalSales:
 *                   type: number
 *                   format: float
 *                   example: 5000.0
 *                 tables:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tableNumber:
 *                         type: string
 *                         example: T1
 *                       totalOrder:
 *                         type: integer
 *                         example: 10
 *                       totalSales:
 *                         type: number
 *                         format: float
 *                         example: 500.0
 *                       orders:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             timeSlot:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-06-30T12:00:00Z
 *                             items:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: Grilled Salmon
 *                                   quantity:
 *                                     type: integer
 *                                     example: 2
 *                                   price:
 *                                     type: number
 *                                     format: float
 *                                     example: 24.99
 *                             subtotal:
 *                               type: number
 *                               format: float
 *                               example: 49.98
 *                             tax:
 *                               type: number
 *                               format: float
 *                               example: 4.99
 *                             total:
 *                               type: number
 *                               format: float
 *                               example: 54.97
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
 *         description: Report not found
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
router.get('/reports/:id', auth(['Admin']), validateRole, reportController.getReportDetails);

module.exports = router;