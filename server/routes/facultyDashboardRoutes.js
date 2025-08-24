// File: server/routes/facultyDashboardRoutes.js

const express = require('express');
const router = express.Router();
const { getTodaysSchedule, getWeeklySchedule, getSessionDetails, getAttendanceRecords } = require('../controllers/facultyDashboardController');
const { protect } = require('../middleware/authMiddleware');

// Custom middleware to check for 'Faculty' role
const isFaculty = (req, res, next) => {
    if (req.user && req.user.role === 'Faculty') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Not a faculty member.' });
    }
};

// All routes in this file are protected and require the user to be a faculty member
router.get('/schedule', protect, isFaculty, getTodaysSchedule);
router.get('/weekly-schedule', protect, isFaculty, getWeeklySchedule);
router.get('/session/:sessionId', protect, isFaculty, getSessionDetails);
router.get('/attendance-records', protect, isFaculty, getAttendanceRecords);

module.exports = router;