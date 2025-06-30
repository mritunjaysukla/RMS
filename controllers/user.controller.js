const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../utils/prisma');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const SECRET_KEY = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const register = async (req, res) => {
  // #swagger.tags = ['User']
  const { username, password, email, contact, dob, gender } = req.body;
  const role = 'Waiter'; // Force role to "Waiter"

  try {
    // Check if the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role "Waiter"
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role, // Forced to "Waiter"
        email,
        contact,
        dob: new Date(dob), // Ensure dob is stored as a Date object
        gender,
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully as Waiter',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        contact: user.contact,
        dob: user.dob.toISOString().split('T')[0], // Format as YYYY-MM-DD
        gender: user.gender,
        role: user.role
      }
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
  // #swagger.tags = ['User']
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or inactive account'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // If the user is a Waiter or Manager, create a duty session
    if (user.role === 'Waiter' || user.role === 'Manager') {
      await prisma.staffOnDuty.create({
        data: {
          userId: user.id,
          startTime: new Date(),
          status: 'Active'
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
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

const forgotPassword = async (req, res) => {
  // #swagger.tags = ['User']
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Generate a 6-digit code
    const resetCode = crypto.randomInt(100000, 999999).toString();

    // Store reset code in database
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        reset_code: resetCode,
        expires_at: new Date(Date.now() + 15 * 60 * 1000) // Expires in 15 minutes
      }
    });

    // Send reset code via email
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}. This code is valid for 15 minutes.`
    });

    res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to send reset code' });
  }
};
const resetPassword = async (req, res) => {
  // #swagger.tags = ['User']
  const { email, resetCode, newPassword, confirmNewPassword } = req.body;

  try {
    // Validate if passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if reset code is valid
    const resetEntry = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        reset_code: resetCode,
        is_used: false,
        expires_at: { gte: new Date() }
      }
    });

    if (!resetEntry) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code'
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // Mark reset code as used
    await prisma.passwordReset.update({
      where: { id: resetEntry.id },
      data: { is_used: true }
    });

    res.status(200).json({
      success: true,
      message:
        'Password reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

const logout = async (req, res) => {
  const { userId } = req.query;

  try {
    // Find the active duty session
    const activeDuty = await prisma.staffOnDuty.findFirst({
      where: {
        userId,
        endTime: null // Only active sessions
      }
    });

    if (!activeDuty) {
      return res.status(404).json({ message: 'No active duty session found' });
    }

    // End the duty session
    await prisma.staffOnDuty.update({
      where: { id: activeDuty.id },
      data: {
        endTime: new Date(),
        status: 'Inactive'
      }
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};
module.exports = {
  register,
  loginUser,
  forgotPassword,
  resetPassword,
  logout
};
