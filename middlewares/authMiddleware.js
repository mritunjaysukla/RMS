const jwt = require("jsonwebtoken");

// Middleware to validate admin token
const validateAdminToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    req.admin = decoded; // Store the decoded token data (admin information) in request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = validateAdminToken;
