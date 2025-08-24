// File: server/controllers/courseController.js

const { sequelize, Course, College, Subject, TimetableEntry, Attendance, AttendanceSubmission } = require('../models');

const getCourses = async (req, res) => {
    try {
        const college = await College.findOne({ where: { adminId: req.user.id } });
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        const courses = await Course.findAll({ where: { collegeId: college.id }, order: [['abbreviation', 'ASC']] });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createCourse = async (req, res) => {
    const { name, abbreviation, totalSemesters } = req.body;
    if (!name || !abbreviation || !totalSemesters) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        const college = await College.findOne({ where: { adminId: req.user.id } });
        const newCourse = await Course.create({
            name, abbreviation, totalSemesters, collegeId: college.id
        });
        res.status(201).json(newCourse);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'A course with this abbreviation already exists.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- THIS FUNCTION IS COMPLETELY REWRITTEN ---
const deleteCourse = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const courseId = req.params.id;
        const collegeId = req.user.collegeId;

        // 1. Authorize and find the course
        const course = await Course.findOne({ where: { id: courseId, collegeId }, transaction });
        if (!course) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Course not found or not authorized.' });
        }

        // 2. Find ALL timetable entries for this course (including library hours)
        const timetableEntries = await TimetableEntry.findAll({
            where: { courseId: courseId },
            attributes: ['id'],
            transaction
        });
        const timetableEntryIds = timetableEntries.map(te => te.id);

        if (timetableEntryIds.length > 0) {
            // 3. Delete all dependent records that point to these timetable entries
            await Attendance.destroy({ where: { timetableEntryId: timetableEntryIds }, transaction });
            await AttendanceSubmission.destroy({ where: { timetableEntryId: timetableEntryIds }, transaction });
            
            // 4. Now, delete the timetable entries themselves
            await TimetableEntry.destroy({ where: { id: timetableEntryIds }, transaction });
        }

        // 5. Delete all subjects for this course
        await Subject.destroy({ where: { courseId: courseId }, transaction });

        // 6. Finally, delete the course
        await course.destroy({ transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Course and all related data deleted successfully' });

    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting course:", error);
        res.status(500).json({ message: 'Server Error during course deletion.' });
    }
};

module.exports = {
  getCourses,
  createCourse,
  deleteCourse,
};
