// File: server/routes/reportsRoutes.js

const express = require('express');
const router = express.Router();
const { getDefaulterList, downloadDefaulterList } = require('../controllers/reportsController'); // Import new function
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/defaulters/:threshold', protect, isAdmin, getDefaulterList);
router.get('/defaulters/download/:threshold', protect, isAdmin, downloadDefaulterList); // Add the new route

module.exports = router;