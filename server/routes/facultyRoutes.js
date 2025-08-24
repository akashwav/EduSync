// File: server/routes/facultyRoutes.js

const express = require('express');
const router = express.Router();
const { getFaculty, createFaculty, deleteFaculty } = require('../controllers/facultyController'); // Import
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.route('/')
  .get(getFaculty)
  .post(createFaculty);

router.route('/:id')
    .delete(deleteFaculty); // Add this line

module.exports = router;