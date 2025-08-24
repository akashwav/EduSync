// File: server/routes/subjectApiRoutes.js

const express = require('express');
const router = express.Router();
const { getAllSubjectsForAdmin } = require('../controllers/subjectController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.route('/')
    .get(getAllSubjectsForAdmin);

module.exports = router;