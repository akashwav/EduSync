// File: server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Protect all routes in this file, only accessible by Admins
router.use(protect, isAdmin);

router.route('/')
  .get(getUsers)
  .post(createUser);

module.exports = router;
