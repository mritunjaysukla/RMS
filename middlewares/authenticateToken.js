const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretKey"; // Same secret key used in login

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.admin = decoded; // Attach the decoded token to req.admin
    next();
  });
};

module.exports = authenticateToken;
