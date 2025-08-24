// File: server/routes/studentDashboardRoutes.js

const express = require('express');
const router = express.Router();
const { getTodaysSchedule, getAttendanceSummary, getWeeklySchedule, getAttendanceHistory  } = require('../controllers/studentDashboardController'); // Import new function
const { protect } = require('../middleware/authMiddleware');

const isStudent = (req, res, next) => {
    if (req.user && req.user.role === 'Student') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Not a student.' });
    }
};

router.use(protect, isStudent);

router.get('/schedule', getTodaysSchedule);
router.get('/attendance-summary', getAttendanceSummary);
router.get('/weekly-schedule', getWeeklySchedule); // Add the new route
router.get('/attendance-history', getAttendanceHistory);

module.exports = router;