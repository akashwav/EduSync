// File: server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { User, Faculty } = require('../models'); // Import the Faculty model

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- THIS IS THE UPDATE ---
      // Fetch the user and their associated Faculty profile if it exists
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
        include: [Faculty] // Include the Faculty model
      });
      // --- END OF UPDATE ---

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

// --- NEW MIDDLEWARE ---
const isFaculty = (req, res, next) => {
    if (req.user && req.user.role === 'Faculty') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a faculty member' });
    }
};

module.exports = { protect, isAdmin, isFaculty }; // Export the new middleware