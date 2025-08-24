// File: server/controllers/studentDashboardController.js

const { Student, TimetableEntry, Subject, Classroom, Course, Faculty, Attendance } = require('../models');

// @desc    Get the daily schedule for the logged-in student
// @route   GET /api/student-dashboard/schedule
// @access  Private (Student)
const getTodaysSchedule = async (req, res) => {
    try {
        const studentProfile = await Student.findOne({ where: { userId: req.user.id } });
        if (!studentProfile) {
            return res.status(404).json({ message: 'Student profile not found.' });
        }

        const today = "Monday";
        // const today = new Date().toLocaleString('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' });

        const schedule = await TimetableEntry.findAll({
            where: {
                section: studentProfile.section,
                dayOfWeek: today
            },
            include: [
                { model: Subject, attributes: ['subjectCode', 'subjectName'] },
                { model: Classroom, attributes: ['roomNumber'] },
                { model: Faculty, attributes: ['name', 'initials'] }
            ],
            order: [['startTime', 'ASC']]
        });

        res.status(200).json(schedule);
    } catch (error) {
        console.error("Error fetching student schedule:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get the overall attendance summary for the logged-in student
// @route   GET /api/student-dashboard/attendance-summary
// @access  Private (Student)
const getAttendanceSummary = async (req, res) => {
    try {
        const studentProfile = await Student.findOne({ where: { userId: req.user.id } });
        if (!studentProfile) {
            return res.status(404).json({ message: 'Student profile not found.' });
        }

        // 1. Find all subjects for the student's section
        const courseAbbr = studentProfile.section.match(/[a-zA-Z]+/)[0];
        const semester = parseInt(studentProfile.section.match(/\d+/)[0], 10);
        const course = await Course.findOne({ where: { abbreviation: courseAbbr } });

        const subjects = await Subject.findAll({
            where: { courseId: course.id, semester: semester }
        });

        // 2. For each subject, calculate attendance
        const summary = [];
        for (const subject of subjects) {
            // Find all classes for this subject and section
            const classSessions = await TimetableEntry.findAll({
                where: { subjectId: subject.id, section: studentProfile.section },
                attributes: ['id']
            });
            const sessionIds = classSessions.map(s => s.id);

            if (sessionIds.length > 0) {
                // Count total classes and present classes for this student
                const totalClasses = await Attendance.count({
                    where: { studentId: studentProfile.id, timetableEntryId: sessionIds }
                });
                const presentClasses = await Attendance.count({
                    where: { studentId: studentProfile.id, timetableEntryId: sessionIds, status: 'Present' }
                });

                

                const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

                summary.push({
                    subjectId: subject.id,
                    subjectName: subject.subjectName,
                    subjectCode: subject.subjectCode,
                    totalClasses,
                    presentClasses,
                    percentage
                });
            }
        }

        res.status(200).json(summary);
    } catch (error) {
        console.error("Error fetching attendance summary:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// --- NEW FUNCTION ---
// @desc    Get the full weekly schedule for the logged-in student
// @route   GET /api/student-dashboard/weekly-schedule
// @access  Private (Student)
const getWeeklySchedule = async (req, res) => {
    try {
        const studentProfile = await Student.findOne({ where: { userId: req.user.id } });
        if (!studentProfile) {
            return res.status(404).json({ message: 'Student profile not found.' });
        }

        const weeklySchedule = await TimetableEntry.findAll({
            where: { section: studentProfile.section },
            include: [Subject, Classroom, Faculty],
            order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']]
        });

        res.status(200).json(weeklySchedule);
    } catch (error) {
        console.error("Error fetching student weekly schedule:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAttendanceHistory = async (req, res) => {
    try {
        const studentProfile = await Student.findOne({ where: { userId: req.user.id } });
        if (!studentProfile) {
            return res.status(404).json({ message: 'Student profile not found.' });
        }

        const history = await Attendance.findAll({
            where: { studentId: studentProfile.id },
            include: [
                {
                    model: TimetableEntry,
                    attributes: ['section'],
                    include: [
                        { model: Subject, attributes: ['subjectName', 'subjectCode'] }
                    ]
                }
            ],
            order: [['date', 'DESC']] // Show the most recent records first
        });

        res.status(200).json(history);

    } catch (error) {
        console.error("Error fetching attendance history:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getTodaysSchedule, getAttendanceSummary, getWeeklySchedule, getAttendanceHistory };