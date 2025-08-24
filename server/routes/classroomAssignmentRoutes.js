// File: server/routes/classroomAssignmentRoutes.js

const express = require('express');
const router = express.Router();
const { getClassroomAssignments } = require('../controllers/classroomAssignmentController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, isAdmin, getClassroomAssignments);

module.exports = router;