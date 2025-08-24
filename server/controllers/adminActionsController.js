// File: server/controllers/adminActionsController.js

const { User } = require('../models');
const bcrypt = require('bcryptjs');

// @desc    Admin resets a user's password
// @route   PUT /api/admin-actions/reset-password/:userId
// @access  Private (Admin)
const adminResetPassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminCollegeId = req.user.collegeId;

        const userToReset = await User.findByPk(userId);

        // 1. Validation Checks
        if (!userToReset) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (userToReset.collegeId.toString() !== adminCollegeId.toString()) {
            return res.status(403).json({ message: 'Not authorized to reset password for this user.' });
        }
        if (userToReset.role === 'Admin' || userToReset.role === 'Superadmin') {
            return res.status(403).json({ message: 'Admins cannot reset passwords for other admins.' });
        }

        // 2. Generate and hash new password
        const tempPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        // 3. Update user directly in the database
        await User.update({
            password: hashedPassword
        }, {
            where: { id: userId },
            hooks: false // Bypass hooks as we are manually hashing
        });

        // 4. Return the temporary password to the admin
        res.status(200).json({
            message: `Password for ${userToReset.email} has been reset successfully.`,
            tempPassword: tempPassword
        });

    } catch (error) {
        console.error("Admin Password Reset Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { adminResetPassword };