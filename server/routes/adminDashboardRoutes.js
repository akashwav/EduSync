// File: server/routes/adminDashboardRoutes.js

const express = require('express');
const router = express.Router();
const { getDashboardStats, completeSetup, getAttendanceTrends } = require('../controllers/adminDashboardController'); // Import new function
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.get('/stats', getDashboardStats);
router.post('/complete-setup', completeSetup);
router.get('/attendance-trends', getAttendanceTrends); // Add the new route

module.exports = router;