const express = require('express');
const { getStaffOnDuty } = require('../controllers/staff.controller');

const router = express.Router();

// Route to get all staff currently on duty
router.get('/staff/on-duty', getStaffOnDuty);

module.exports = router;
