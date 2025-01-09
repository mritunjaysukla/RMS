const jwt = require("jsonwebtoken");
const { prisma } = require("../utils/prisma");

// Middleware to validate admin token
const auth = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // if (decoded.role !== "ADMIN") {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, role: true },
    });

    req.user = user; // Store the decoded token data (admin information) in request
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
