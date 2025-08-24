// File: server/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { triggerDefaulterAlerts } = require('../controllers/notificationController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/send-defaulter-alerts', protect, isAdmin, triggerDefaulterAlerts);

module.exports = router;