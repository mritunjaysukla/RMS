const jwt = require('jsonwebtoken');
const { prisma } = require('../utils/prisma');
require('dotenv').config();

// Middleware to validate admin token
const auth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', req.headers['authorization']);

  if (!authHeader) {
    return res.status(403).json({ message: 'Token is required' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>" format
  console.log('Extracted Token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: Malformed token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token', decoded);
    // if (decoded.role !== "ADMIN") {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, role: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // attach user data to the request
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;
