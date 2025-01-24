const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

// Create User
exports.createUser = async (req, res) => {
  // #swagger.tags = ['Auth']
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // Hash the password

    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, role }
    });

    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Read All Users
exports.getUsers = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true } // Exclude passwords
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Read a Single User
exports.getUserById = async (req, res) => {
  // #swagger.tags = ['Auth']
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, username: true, role: true } // Exclude password
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  // #swagger.tags = ['Auth']
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    const updateData = { username, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, SALT_ROUNDS); // Hash the new password
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res
      .status(200)
      .json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  // #swagger.tags = ['Auth']
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
