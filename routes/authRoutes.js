const express = require("express");
const { createUser } = require("../controllers/adminController");
const auth = require("../middlewares/authMiddleware");
const validateRole = require("../middlewares/roleMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/createUser", auth, validateRole(["ADMIN"]), createUser);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.delete("/deleteUser", authController.deleteUser);

module.exports = router;
