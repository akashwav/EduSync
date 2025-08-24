// File: server/routes/passwordResetRoutes.js

const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/passwordResetController');

router.post('/forgot', forgotPassword);
router.put('/reset/:token', resetPassword);

module.exports = router;