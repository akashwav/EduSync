// File: server/routes/superadminRoutes.js

const express = require('express');
const router = express.Router();
const { onboardCollege } = require('../controllers/superadminController');
const { protect } = require('../middleware/authMiddleware');

// Custom middleware to ensure only Superadmin can access these routes
const isSuperadmin = (req, res, next) => {
    if (req.user && req.user.role === 'Superadmin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Superadmin role required.' });
    }
};

router.post('/onboard-college', protect, isSuperadmin, onboardCollege);

module.exports = router;