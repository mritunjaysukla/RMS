const express = require('express');
const staffController = require('../controllers/staff.controller');
const { auth } = require('../middlewares/auth.middleware');
const validateRole = require('../middlewares/role.middleware');
const router = express.Router();

// Route to get all staff currently on duty
router.get(
  '/staff',
  auth(['Admin', 'Manager']),
  validateRole,
  staffController.getAllStaff
);

router.get(
  '/staffOnDuty',
  auth(['Admin', 'Manager']),
  validateRole,
  staffController.getStaffOnDuty
);

router.delete(
  '/staff/:id',
  auth(['Admin']),
  validateRole,
  staffController.deleteStaff
);

module.exports = router;
