
const express = require('express');
const router = express.Router();
const { getGeofence, setGeofence } = require('../controllers/geofenceController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.route('/')
    .get(getGeofence)
    .post(setGeofence);

module.exports = router;