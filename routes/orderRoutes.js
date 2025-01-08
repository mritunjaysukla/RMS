const express = require("express");
const router = express.Router();
const { getOrders, handlePayment } = require("../controllers/orderController");
const authenticateToken = require("../middlewares/authenticateToken");
const validateRole = require("../middlewares/validateRole");

router.get("/", authenticateToken, validateRole(["MANAGER"]), getOrders);
router.post(
  "/payment",
  authenticateToken,
  validateRole(["MANAGER"]),
  handlePayment
);

module.exports = router;
