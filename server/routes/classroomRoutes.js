// File: server/routes/classroomRoutes.js

const express = require('express');
const router = express.Router();
const { getClassrooms, createClassroom, deleteClassroom } = require('../controllers/classroomController'); // Import
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.route('/')
  .get(getClassrooms)
  .post(createClassroom);

router.route('/:id')
    .delete(deleteClassroom); // Add this line

module.exports = router;