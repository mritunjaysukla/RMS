const express = require("express");
const auth = require("../middlewares/authMiddleware");
const validateRole = require("../middlewares/roleMiddleware");
const {
  addMenuItem,
  approveMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

// Route to add a menu item (accessible to ADMIN and MANAGER)
router.post("/menu", auth, validateRole(["ADMIN", "MANAGER"]), addMenuItem);

// Approve Menu Item Route
router.patch(
  "/menu/approve/:id",
  auth,
  validateRole(["ADMIN"]),
  approveMenuItem
);

module.exports = router;
