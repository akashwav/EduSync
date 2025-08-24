// File: server/controllers/passwordResetController.js

const { User } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'luis.cormier@ethereal.email', // Use your latest Ethereal credentials
        pass: 'rwyqSvHUfMTvqbM1C9'
    }
});

const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(200).json({ message: 'Email sent.' });
        }

        const resetToken = user.getResetPasswordToken();
        // We still need to save the token to the user instance
        await user.save({ fields: ['resetPasswordToken', 'resetPasswordExpire'] });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: '"EduSync System" <noreply@edusync.com>',
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>Please click the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link will expire in 10 minutes.</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        
        res.status(200).json({ message: 'Email sent.' });

    } catch (error) {
        // ... (error handling)
    }
};

const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            where: {
                resetPasswordToken,
                resetPasswordExpire: { [require('sequelize').Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // --- THIS IS THE DEFINITIVE FIX ---
        // Manually hash the new password.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Use a direct database UPDATE command instead of user.save()
        await User.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpire: null
        }, {
            where: { id: user.id },
            hooks: false // Explicitly disable hooks for this operation
        });
        // --- END OF FIX ---

        res.status(200).json({ message: 'Password reset successful.' });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { forgotPassword, resetPassword };