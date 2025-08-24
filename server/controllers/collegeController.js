// File: server/controllers/collegeController.js

const { College } = require('../models');

// @desc    Get college details for the logged-in admin
// @route   GET /api/college
// @access  Private (Admin)
const getCollegeDetails = async (req, res) => {
  try {
    const college = await College.findOne({ where: { adminId: req.user.id } });

    if (!college) {
      return res.status(404).json({ message: 'College details not found. Please add them.' });
    }

    res.status(200).json(college);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create or update college details
// @route   POST /api/college
// @access  Private (Admin)
const upsertCollegeDetails = async (req, res) => {
  const { name, address, affiliatedUniversity } = req.body;

  if (!name || !address || !affiliatedUniversity) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }

  try {
    // Check if college details already exist for this admin
    let college = await College.findOne({ where: { adminId: req.user.id } });

    if (college) {
      // Update existing details
      college.name = name;
      college.address = address;
      college.affiliatedUniversity = affiliatedUniversity;
      await college.save();
      res.status(200).json(college);
    } else {
      // Create new details
      college = await College.create({
        name,
        address,
        affiliatedUniversity,
        adminId: req.user.id,
      });
      res.status(201).json(college);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCollegeDetails,
  upsertCollegeDetails,
};