const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create User
exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = await prisma.user.create({
      data: { username, password, role },
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Read All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Read a Single User
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { username, password, role },
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
