// File: server/routes/timetableRoutes.js

const express = require('express');
const router = express.Router();
const { generateTimetable, getTimetable } = require('../controllers/timetableController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/generate', protect, isAdmin, generateTimetable);
router.get('/', protect, getTimetable);

module.exports = router;