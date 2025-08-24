// File: server/routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const { getStudents, createStudent, deleteStudent } = require('../controllers/studentController'); // Import
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
    .delete(deleteStudent); // Add this line

module.exports = router;