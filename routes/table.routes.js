const express = require('express');
const {
  getTableStatus,
  updateTableStatus
} = require('../controllers/table.controller');
const router = express.Router();

// Route to get table statuses
router.get('/tables', getTableStatus);

// Route to update table status
router.patch('/tables/:tableId', updateTableStatus);

module.exports = router;
