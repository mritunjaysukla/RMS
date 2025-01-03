const require = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

//routes
//Register
router.post("/register", register);

//login
router.post("/login", login);
modules.exports = router;
