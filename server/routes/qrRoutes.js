// File: server/routes/qrRoutes.js

const express = require('express');
const router = express.Router();
const { generateQrToken } = require('../controllers/qrController');
const { protect } = require('../middleware/authMiddleware');

const isFaculty = (req, res, next) => {
    if (req.user && req.user.role === 'Faculty') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Not a faculty member.' });
    }
};

router.get('/generate/:timetableEntryId', protect, isFaculty, generateQrToken);

module.exports = router;