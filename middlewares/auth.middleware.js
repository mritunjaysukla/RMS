const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Access token required'
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, username: true, role: true, isActive: true }
      });

      if (!user || !user.isActive) {
        return res
          .status(403)
          .json({ success: false, message: 'User not found or inactive' });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res
          .status(403)
          .json({ success: false, message: 'Insufficient permissions' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res
        .status(401)
        .json({ success: false, message: 'Invalid or expired token' });
    }
  };
};

module.exports = { auth };
