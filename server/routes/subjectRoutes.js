// File: server/routes/subjectRoutes.js

const express = require('express');
// The `mergeParams: true` option is crucial for accessing :courseId from the parent router
const router = express.Router({ mergeParams: true }); 
const { getSubjectsByCourse, addSubject } = require('../controllers/subjectController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.route('/')
  .get(getSubjectsByCourse)
  .post(addSubject);

module.exports = router;