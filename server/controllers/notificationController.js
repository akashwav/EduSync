// File: server/controllers/notificationController.js

const { sendLowAttendanceAlerts } = require('../services/notificationService');

// @desc    Trigger the sending of low attendance alerts
// @route   POST /api/notifications/send-defaulter-alerts
// @access  Private (Admin)
const triggerDefaulterAlerts = async (req, res) => {
    const { threshold } = req.body;

    if (!threshold || isNaN(threshold)) {
        return res.status(400).json({ message: 'A valid threshold percentage is required.' });
    }

    const collegeId = req.user.collegeId;
    if (!collegeId) {
        return res.status(403).json({ message: 'Admin not associated with a college.' });
    }

    const result = await sendLowAttendanceAlerts(collegeId, threshold);

    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
};

module.exports = { triggerDefaulterAlerts };