// Middleware to validate the role of the user
const validateRole = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure that req.admin exists
    if (!req.user || !req.user.role) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user information" });
    }

    const userRole = req.user.role;

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
