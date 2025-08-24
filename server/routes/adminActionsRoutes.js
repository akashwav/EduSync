// File: server/routes/adminActionsRoutes.js

const express = require('express');
const router = express.Router();
const { adminResetPassword } = require('../controllers/adminActionsController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All routes in this file are protected and for Admins only
router.put('/reset-password/:userId', protect, isAdmin, adminResetPassword);

module.exports = router;