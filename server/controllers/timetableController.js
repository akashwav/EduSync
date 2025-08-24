// File: server/controllers/timetableController.js

const TimetableGenerator = require('../services/timetableGenerator');
const { College, TimetableEntry, Classroom, Subject, Faculty, Course } = require('../models'); // Removed TimeSlot

// @desc    Trigger the timetable generation process
// @route   POST /api/timetable/generate
// @access  Private (Admin)
const generateTimetable = async (req, res) => {
    try {
        const college = await College.findOne({ where: { adminId: req.user.id } });
        if (!college) {
            return res.status(404).json({ message: 'College not found.' });
        }

        const generator = new TimetableGenerator(college.id);
        const result = await generator.generate();

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(500).json({ message: result.message || 'Failed to generate timetable.' });
        }
    } catch (error) {
        console.error('Timetable Generation Error:', error);
        res.status(500).json({ message: 'An unexpected error occurred during generation.' });
    }
};

// @desc    Get the generated timetable
// @route   GET /api/timetable
// @access  Private
const getTimetable = async (req, res) => {
    try {
        const college = await College.findOne({ where: { adminId: req.user.id } });
        if (!college) {
            // It's better to return an empty array if no college is found yet
            return res.status(200).json([]);
        }
        
        const timetable = await TimetableEntry.findAll({
            where: { collegeId: college.id },
            // --- THIS IS THE FIX ---
            // Removed TimeSlot from the include array
            include: [Classroom, Subject, Faculty, Course]
        });
        res.status(200).json(timetable);
    } catch (error) {
        console.error('Get Timetable Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { generateTimetable, getTimetable };