const bcrypt = require('bcrypt');
const { prisma } = require('../utils/prisma');

const SALT_ROUNDS = 10;

// Create User

// Create User (Admin Only)
exports.createUser = async (req, res) => {
  // #swagger.tags = ['Auth']
  const { username, password, role, email, dob, gender, contact } = req.body;

  try {
    // Ensure only admins can create users
    if (req.user.role !== 'Admin') {
      return res
        .status(403)
        .json({ message: 'Access denied. Only admins can create users.' });
    }

    // Validate required fields
    if (
      !username ||
      !password ||
      !role ||
      !email ||
      !dob ||
      !gender ||
      !contact
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate role (assuming allowed roles are 'Admin', 'Manager', 'User')
    const allowedRoles = ['Admin', 'Manager', 'User'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    // Check if the email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Convert dob to Date object
    const formattedDob = new Date(dob);
    if (isNaN(formattedDob)) {
      return res.status(400).json({ message: 'Invalid date of birth format' });
    }

    // Create the new user with isApproved: true (since admin is adding them)
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        email,
        dob: formattedDob,
        gender,
        contact,
        isApproved: true // Since admin is adding, the user is already approved
      }
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isApproved: newUser.isApproved
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);

    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Email must be unique' });
    }

    res
      .status(500)
      .json({ message: 'Error creating user', error: error.message });
  }
};

// Read All Users
exports.getUsers = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        email: true,
        dob: true,
        gender: true,
        contact: true
      } // Select required fields
    });

    // Format the dob field to 'YYYY-MM-DD' format
    const formattedUsers = users.map((user) => ({
      ...user,
      dob: user.dob ? user.dob.toISOString().split('T')[0] : null // Format dob
    }));

    res.status(200).json(formattedUsers);
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
      select: {
        id: true,
        username: true,
        role: true,
        email: true,
        dob: true,
        gender: true,
        contact: true
      } // Select required fields
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Format the dob field to 'YYYY-MM-DD' format
    user.dob = user.dob ? user.dob.toISOString().split('T')[0] : null;

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
  const { username, password, role, email, dob, gender, contact } = req.body;

  try {
    // Prepare the update data
    const updateData = {
      username,
      role,
      email,
      dob: new Date(dob), // Ensure the date is saved correctly
      gender,
      contact
    };

    // If password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, SALT_ROUNDS); // Hash the new password
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Return success response
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
