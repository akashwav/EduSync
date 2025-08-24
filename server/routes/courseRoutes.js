// File: server/routes/courseRoutes.js

const express = require('express');
const router = express.Router();
const { getCourses, createCourse, deleteCourse } = require('../controllers/courseController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const subjectRouter = require('./subjectRoutes'); // Import the subject router

// --- Nested Route ---
// Re-route any request that looks like /api/courses/:courseId/subjects
// to the subjectRouter.
router.use('/:courseId/subjects', subjectRouter);

// --- Main Course Routes ---
router.use(protect, isAdmin);

router.route('/')
  .get(getCourses)
  .post(createCourse);

router.route('/:id')
    .delete(deleteCourse);

module.exports = router;