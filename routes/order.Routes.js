const express = require("express");
const router = express.Router();
const { getOrders, handlePayment } = require("../controllers/order.Controller");
const validateRole = require("../middlewares/role.Middleware");
const auth = require("../middlewares/auth.Middleware");

router.get("/", auth, validateRole(["MANAGER"]), getOrders);
router.post("/payment", auth, validateRole(["MANAGER"]), handlePayment);

module.exports = router;
