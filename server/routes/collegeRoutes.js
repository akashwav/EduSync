// File: server/routes/collegeRoutes.js

const express = require('express');
const router = express.Router();
const { getCollegeDetails, upsertCollegeDetails } = require('../controllers/collegeController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All routes in this file are protected and require the user to be an admin
router.route('/')
  .get(protect, isAdmin, getCollegeDetails)
  .post(protect, isAdmin, upsertCollegeDetails);

module.exports = router;