// Middleware to validate the role of the user
const validateRole = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure that req.admin exists
    if (!req.admin || !req.admin.role) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No admin information" });
    }

    const userRole = req.admin.role;

    // Check if the user's role is allowed
    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};

module.exports = validateRole;
