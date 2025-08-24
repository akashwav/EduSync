
const express = require('express');
const router = express.Router();
// --- THIS IS THE FIX ---
// The import now correctly includes all the necessary functions.
const {
    getStudentsForAttendance,
    submitAttendance,
    detectAnomalies,
    getAttendanceForSession,
    verifyAndSubmitAttendance,
    checkIn
} = require('../controllers/attendanceController');
// --- END OF FIX ---
const { protect } = require('../middleware/authMiddleware');

const isFaculty = (req, res, next) => {
    if (req.user && req.user.role === 'Faculty') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Not a faculty member.' });
    }
};

const isStudent = (req, res, next) => {
    if (req.user && req.user.role === 'Student') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Not a student.' });
    }
};

// Routes for Faculty
router.get('/session/:timetableEntryId', protect, isFaculty, getStudentsForAttendance);
router.post('/submit', protect, isFaculty, submitAttendance);
router.post('/anomalies', protect, isFaculty, detectAnomalies);
router.get('/records/:timetableEntryId/:date', protect, isFaculty, getAttendanceForSession);

router.post('/check-in', protect, isStudent, checkIn);
// Route for Students
router.post('/verify', protect, isStudent, verifyAndSubmitAttendance);

module.exports = router;