const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../utils/prisma');
const SECRET_KEY = process.env.JWT_SECRET; // Use an environment variable for production

// Register a User

const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Hash password with salt rounds of 10
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Registration:', {
      originalPassword: password,
      hashedPassword: hashedPassword
    });

    // eslint-disable-next-line no-unused-vars
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};
const loginUser = async (req, res) => {
  // #swagger.tags = ['Auth']
  const { username, password } = req.body;

  try {
    // Step 1: Find user and log raw values
    const user = await prisma.user.findUnique({
      where: { username }
    });

    console.log('Login attempt:', {
      providedUsername: username,
      providedPassword: password,
      userFound: !!user,
      storedHash: user ? user.password : null
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User not found' });
    }

    // Step 2: Compare passwords with detailed logging
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison:', {
      plainPassword: password,
      storedHash: user.password,
      isValid: isPasswordValid
    });

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete User by ID
const deleteUser = async (req, res) => {
  const { id } = req.params; // User ID from the URL params

  try {
    // Find user by ID
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Delete the user
    await prisma.user.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
module.exports = { register, loginUser, deleteUser };
