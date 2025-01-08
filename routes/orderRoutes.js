const express = require("express");
const router = express.Router();
const { getOrders, handlePayment } = require("../controllers/orderController");
const validateRole = require("../middlewares/roleMiddleware");
const auth = require("../middlewares/authMiddleware");

router.get("/", auth, validateRole(["MANAGER"]), getOrders);
router.post("/payment", auth, validateRole(["MANAGER"]), handlePayment);

module.exports = router;
