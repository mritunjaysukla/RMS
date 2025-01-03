const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretKey"; // Replace with environment variable in production

// Middleware to verify token and role
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
      req.user = decoded;

      // Check if user's role is allowed
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Insufficient permissions.",
        });
      }

      next(); // User is authorized, proceed to the next middleware/controller
    } catch (err) {
      console.error("Invalid token:", err);
      res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
  };
};

module.exports = checkRole;
