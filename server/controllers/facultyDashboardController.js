// File: server/controllers/facultyDashboardController.js

const { Faculty, TimetableEntry, Subject, Classroom, Course } = require('../models');

const getTodaysSchedule = async (req, res) => {
    try {
        const facultyProfile = await Faculty.findOne({ where: { userId: req.user.id } });
        if (!facultyProfile) {
            return res.status(404).json({ message: 'Faculty profile not found.' });
        }
        const today = "Monday";
        // const today = new Date().toLocaleString('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' });
        const schedule = await TimetableEntry.findAll({
            where: { facultyId: facultyProfile.id, dayOfWeek: today },
            include: [
                { model: Subject, attributes: ['subjectCode', 'subjectName'] },
                { model: Classroom, attributes: ['roomNumber'] },
                { model: Course, attributes: ['abbreviation'] }
            ],
            order: [['startTime', 'ASC']]
        });
        res.status(200).json(schedule);
    } catch (error) {
        console.error("Error fetching faculty schedule:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getWeeklySchedule = async (req, res) => {
    try {
        const facultyProfile = await Faculty.findOne({ where: { userId: req.user.id } });
        if (!facultyProfile) {
            return res.status(404).json({ message: 'Faculty profile not found.' });
        }

        const weeklySchedule = await TimetableEntry.findAll({
            where: { facultyId: facultyProfile.id },
            include: [Subject, Classroom, Course],
            order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']]
        });

        res.status(200).json(weeklySchedule);
    } catch (error) {
        console.error("Error fetching faculty weekly schedule:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get details for a single class session
// @route   GET /api/faculty-dashboard/session/:sessionId
// @access  Private (Faculty)
const getSessionDetails = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await TimetableEntry.findByPk(sessionId, {
            // --- THIS IS THE FIX ---
            // 'required: false' ensures a LEFT JOIN, which handles null subjectId for library hours.
            include: [
                { model: Subject, attributes: ['subjectCode', 'subjectName'], required: false },
                { model: Classroom, attributes: ['roomNumber'] }
            ]
            // --- END OF FIX ---
        });
        if (!session) {
            return res.status(404).json({ message: "Session not found." });
        }
        res.status(200).json(session);
    } catch (error) {
        console.error("Error fetching session details:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAttendanceRecords = async (req, res) => {
    try {
        const facultyProfile = await Faculty.findOne({ where: { userId: req.user.id } });
        if (!facultyProfile) {
            return res.status(404).json({ message: 'Faculty profile not found.' });
        }

        const records = await require('../models').AttendanceSubmission.findAll({
            where: { facultyId: facultyProfile.id },
            include: [{
                model: TimetableEntry,
                include: [Subject, Classroom]
            }],
            order: [['date', 'DESC']]
        });

        res.status(200).json(records);
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getTodaysSchedule, getWeeklySchedule, getSessionDetails, getAttendanceRecords };