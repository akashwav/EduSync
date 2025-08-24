// File: server/controllers/qrController.js

const jwt = require('jsonwebtoken');

// @desc    Generate a time-sensitive QR code token for a class session
// @route   GET /api/qr/generate/:timetableEntryId
// @access  Private (Faculty)
const generateQrToken = async (req, res) => {
    try {
        const { timetableEntryId } = req.params;
        const collegeId = req.user.collegeId;

        // Create a payload with the necessary information
        const payload = {
            timetableEntryId,
            collegeId,
            timestamp: Date.now() // Ensures the token is unique every time
        };

        // Sign the token with a short expiration time (e.g., 30 seconds)
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30s' });

        res.status(200).json({ qrToken: token });

    } catch (error) {
        console.error("Error generating QR token:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { generateQrToken };