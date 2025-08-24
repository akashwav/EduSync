// File: server/controllers/superadminController.js

const { sequelize, User, College } = require('../models');

// @desc    Onboard a new college and create its admin account
// @route   POST /api/superadmin/onboard-college
// @access  Private (Superadmin only)
const onboardCollege = async (req, res) => {
    const { collegeName, collegeAddress, affiliatedUniversity, adminEmail } = req.body;

    if (!collegeName || !collegeAddress || !affiliatedUniversity || !adminEmail) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const transaction = await sequelize.transaction();

    try {
        const adminExists = await User.findOne({ where: { email: adminEmail } });
        if (adminExists) {
            await transaction.rollback();
            return res.status(400).json({ message: 'A user with this admin email already exists.' });
        }

        const tempPassword = Math.random().toString(36).slice(-8);

        // 1. Create the new College
        const newCollege = await College.create({
            name: collegeName,
            address: collegeAddress,
            affiliatedUniversity: affiliatedUniversity,
            // adminId will be set in the next step
        }, { transaction });

        // 2. Create the new Admin User for that college
        const newAdmin = await User.create({
            email: adminEmail,
            password: tempPassword, // The model hook will hash this
            role: 'Admin',
            collegeId: newCollege.id // Link the admin to the new college
        }, { transaction });

        // 3. Update the college with the new admin's ID
        newCollege.adminId = newAdmin.id;
        await newCollege.save({ transaction });

        await transaction.commit();

        res.status(201).json({
            message: 'College onboarded successfully.',
            college: newCollege,
            admin: {
                id: newAdmin.id,
                email: newAdmin.email,
                tempPassword: tempPassword // Return the password for the Superadmin to share
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Onboarding Error:", error);
        res.status(500).json({ message: 'Server Error during onboarding.' });
    }
};

module.exports = { onboardCollege };