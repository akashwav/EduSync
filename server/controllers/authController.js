// File: server/controllers/authController.js

const { User, Faculty, Student } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user, name) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, collegeId: user.collegeId, name: name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      let name = user.email; // Default to email
      if (user.role === 'Faculty') {
          const profile = await Faculty.findOne({ where: { userId: user.id } });
          if (profile) name = profile.name;
      } else if (user.role === 'Student') {
          const profile = await Student.findOne({ where: { userId: user.id } });
          if (profile) name = profile.name;
      }

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        token: generateToken(user, name),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const registerSuperadmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if a Superadmin already exists to prevent creating more than one
        const superadminExists = await User.findOne({ where: { role: 'Superadmin' } });
        if (superadminExists) {
            return res.status(403).json({ message: 'A Superadmin account already exists.' });
        }

        // Create the new user with the Superadmin role
        const user = await User.create({
            email,
            password,
            role: 'Superadmin',
            collegeId: null // Superadmin is not associated with any college
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role,
            token: generateToken(user, user.email), // generateToken needs name
        });

    } catch (error) {
        console.error("Error registering superadmin:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const registerAdmin = async (req, res) => { /* ... (no change) ... */ };

module.exports = {
  loginUser,
  registerSuperadmin,
  registerAdmin,
};