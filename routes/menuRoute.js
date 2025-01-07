const express = require("express");
const validateAdminToken = require("../middlewares/authMiddleware");
const validateRole = require("../middlewares/roleMiddleware");
const {
  addMenuItem,
  approveMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

// Route to add a menu item (accessible to ADMIN and MANAGER)
router.post("/menu", validateRole(["ADMIN", "MANAGER"]), addMenuItem);

// Approve Menu Item Route
router.patch(
  "/menu/approve/:id",
  validateAdminToken,
  validateRole(["ADMIN"]),
  approveMenuItem
);

module.exports = router;
