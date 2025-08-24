// File: server/controllers/userController.js

const User = require('../models/User');
const College = require('../models/College');
const { Op } = require('sequelize');

// A simple function to generate a random password
const generateRandomPassword = () => {
  // This is a simple generator. For production, consider a more robust library.
  return Math.random().toString(36).slice(-8);
};

// @desc    Get all users (Faculty/Student) for the admin's college
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const college = await College.findOne({ where: { adminId: req.user.id } });
    if (!college) {
      return res.status(404).json({ message: 'College not found for this admin.' });
    }

    const users = await User.findAll({
      where: {
        collegeId: college.id,
        role: { [Op.ne]: 'Admin' } // Exclude the Admin role itself
      },
      attributes: ['id', 'email', 'role', 'createdAt'] // Don't send password hashes
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new user (Faculty or Student)
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: 'Please provide an email and a role.' });
  }

  if (role === 'Admin') {
    return res.status(400).json({ message: 'Cannot create another Admin user.' });
  }

  try {
    const college = await College.findOne({ where: { adminId: req.user.id } });
    if (!college) {
      return res.status(404).json({ message: 'Admin must have college details set up first.' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const password = generateRandomPassword();

    const newUser = await User.create({
      email,
      password, // The model hook will hash this automatically
      role,
      collegeId: college.id,
    });
    
    // Respond with the new user's details AND the temporary password
    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      tempPassword: password, // IMPORTANT: Send this back to the admin
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUsers,
  createUser,
};