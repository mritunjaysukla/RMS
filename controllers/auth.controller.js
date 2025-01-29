const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

// Create User
exports.createUser = async (req, res) => {
  // #swagger.tags = ['Auth']
  const { username, password, role, email, dob, gender, contact } = req.body;

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

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        email,
        dob: new Date(dob), // Ensure the date is saved correctly
        gender,
        contact
      }
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
