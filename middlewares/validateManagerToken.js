const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to validate manager token
const validateManagerToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    if (decoded.role !== "MANAGER") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    req.manager = decoded; // Store the decoded token data (manager information) in request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = validateManagerToken;
