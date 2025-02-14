const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');

// Generate Report (Manager only)
router.post(
  '/reports',
  auth(['Manager']),
  validateRole,
  reportController.generateReport
);

// Get All Reports (Admin only)
router.get(
  '/reports',
  auth(['Admin']),
  validateRole,
  reportController.getAllReports
);

// Get Report Details (Admin only)
router.get(
  '/reports/:id',
  auth(['Admin']),
  validateRole,
  reportController.getReportDetails
);

module.exports = router;
