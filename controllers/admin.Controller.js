const { PrismaClient } = require("@prisma/client");
const validateAdminToken = require("../middlewares/auth.Middleware");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// Log audit action
const logAudit = async (adminId, action, details) => {
  try {
    await prisma.audit.create({
      data: {
        adminId,
        action,
        details,
      },
    });
  } catch (error) {
    console.error("Error logging audit: ", error);
  }
};

// Create user function
const createUser = async (req, res) => {
  const { username, password, role } = req.body;
  const adminId = req.admin.id; // Assuming JWT has admin info in the request

  try {
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Create new user
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, role },
    });

    // Log the admin action
    logAudit(
      adminId,
      "CREATE_USER",
      `Created a new user with username: ${username}`
    );

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Export createUser to be used in the routes
module.exports = { createUser };
