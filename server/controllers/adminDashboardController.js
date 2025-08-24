// File: server/controllers/adminDashboardController.js

const { College, Student, Faculty, Course, Attendance } = require('../models');
const { Op, fn, col, literal } = require('sequelize'); // Import Sequelize functions

// ... (getDashboardStats and completeSetup functions remain the same)
const getDashboardStats = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        if (!collegeId) {
            return res.status(403).json({ message: 'Admin not associated with a college.' });
        }
        const [studentCount, facultyCount, courseCount, college, classroomCount] = await Promise.all([
            Student.count({ where: { collegeId } }),
            Faculty.count({ where: { collegeId } }),
            Course.count({ where: { collegeId } }),
            College.findByPk(collegeId, { attributes: ['isSetupComplete'] }),
            require('../models').Classroom.count({ where: { collegeId } }) // Correct way to get Classroom model
        ]);
        res.status(200).json({
            studentCount, facultyCount, courseCount, isSetupComplete: college.isSetupComplete, classroomCount
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const completeSetup = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        await College.update({ isSetupComplete: true }, { where: { id: collegeId } });
        res.status(200).json({ message: 'Setup marked as complete.' });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


// --- NEW FUNCTION ---
// @desc    Get attendance trend data for the last 6 months
// @route   GET /api/admin-dashboard/attendance-trends
// @access  Private (Admin)
const getAttendanceTrends = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        if (!collegeId) {
            return res.status(403).json({ message: 'Admin not associated with a college.' });
        }

        const courses = await Course.findAll({ where: { collegeId } });
        const trends = [];

        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        for (const course of courses) {
            const totalClasses = await Attendance.count({
                where: {
                    collegeId,
                    date: { [Op.between]: [firstDayOfMonth, lastDayOfMonth] }
                },
                include: [{
                    model: require('../models').TimetableEntry,
                    where: { courseId: course.id },
                    attributes: []
                }]
            });

            const presentClasses = await Attendance.count({
                where: {
                    collegeId,
                    status: { [Op.or]: ['Present', 'Late'] },
                    date: { [Op.between]: [firstDayOfMonth, lastDayOfMonth] }
                },
                include: [{
                    model: require('../models').TimetableEntry,
                    where: { courseId: course.id },
                    attributes: []
                }]
            });

            const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
            
            trends.push({
                department: course.abbreviation,
                percentage: percentage
            });
        }

        res.status(200).json(trends);

    } catch (error) {
        console.error("Error fetching attendance trends:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getDashboardStats, completeSetup, getAttendanceTrends };

