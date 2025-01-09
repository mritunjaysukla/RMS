const express = require("express");
const { createUser } = require("../controllers/admin.Controller");
const auth = require("../middlewares/auth.Middleware");
const validateRole = require("../middlewares/role.Middleware");
const authController = require("../controllers/auth.Controller");

const router = express.Router();

router.post("/createUser", auth, validateRole(["ADMIN"]), createUser);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.delete("/deleteUser", authController.deleteUser);

module.exports = router;
