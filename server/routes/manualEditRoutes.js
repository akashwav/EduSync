// File: server/routes/manualEditRoutes.js

const express = require('express');
const router = express.Router();
const { updateTimetableEntry } = require('../controllers/manualEditController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// This route is protected and only accessible by Admins
router.put('/:entryId', protect, isAdmin, updateTimetableEntry);

module.exports = router;