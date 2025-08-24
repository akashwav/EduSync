// File: server/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerAdmin, loginUser, registerSuperadmin } = require('../controllers/authController');

router.post('/register', registerAdmin);
router.post('/login', loginUser);
router.post('/register-superadmin', registerSuperadmin); // Add the new route

module.exports = router;