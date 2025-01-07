const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET; // Use an environment variable for production

// Register a User
const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Validate: Check if the username already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already registered, please log in.",
      });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user in the database
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, role },
    });

    // Remove sensitive data
    const { password: _, createdById, ...userWithoutSensitiveData } = user;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

// Login a User
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required.",
    });
  }

  try {
    // Find user by username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.password !== password)
      return res.status(403).json({ error: "Invalid credentials" });
    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log(token, "login token");
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Failed to log in user" });
  }
};

// Delete User by ID
const deleteUser = async (req, res) => {
  const { id } = req.params; // User ID from the URL params

  try {
    // Find user by ID
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Delete the user
    await prisma.user.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
module.exports = { register, login, deleteUser };
