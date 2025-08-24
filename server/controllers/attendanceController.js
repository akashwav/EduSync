
const { Student, TimetableEntry, Attendance, College, Faculty, AttendanceSubmission, Course } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

// Helper function to calculate distance

const verifyAndSubmitAttendance = async (req, res) => {
    // It only requires the session ID from the QR code.
    const { qrToken: sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ message: 'QR code data is missing.' });
    }

    try {
        // 1. Find the student's profile.
        const studentProfile = await Student.findOne({ where: { userId: req.user.id } });
        if (!studentProfile) {
            return res.status(404).json({ message: 'Your student profile could not be found.' });
        }

        // 2. Find the class session to ensure it's valid.
        const classSession = await TimetableEntry.findByPk(sessionId);
        if (!classSession) {
            return res.status(404).json({ message: 'The class session from the QR code is invalid.' });
        }

        // 3. Verify the student belongs to the correct section.
        if (studentProfile.section !== classSession.section) {
            return res.status(403).json({ message: 'Attendance denied. You are not enrolled in this class section.' });
        }

        // 4. Check if attendance has already been marked for this class today.
        const today = new Date().toISOString().slice(0, 10);
        const [attendanceRecord, created] = await Attendance.findOrCreate({
            where: {
                date: today,
                studentId: studentProfile.id,
                timetableEntryId: sessionId
            },
            defaults: {
                status: 'Present',
                collegeId: studentProfile.collegeId,
            }
        });

        if (!created) {
            return res.status(409).json({ message: 'You have already checked in for this class.' });
        }

        // 5. If all checks pass, send a success message.
        res.status(201).json({ message: 'Attendance marked successfully!' });

    } catch (error) {
        // This robust catch block will prevent server crashes.
        console.error("FATAL ERROR in verifyAndSubmitAttendance:", error);
        res.status(500).json({ message: "An unexpected server error occurred. Please contact support." });
    }
};

const getStudentsForAttendance = async (req, res) => {
    try {
        const { timetableEntryId } = req.params;
        const classSession = await TimetableEntry.findByPk(timetableEntryId);
        if (!classSession) {
            return res.status(404).json({ message: 'Class session not found.' });
        }
        const students = await Student.findAll({
            where: { section: classSession.section },
            order: [['name', 'ASC']]
        });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const submitAttendance = async (req, res) => {
    const { timetableEntryId, attendanceData } = req.body;
    if (!timetableEntryId || !attendanceData) {
        return res.status(400).json({ message: 'Invalid data provided.' });
    }
    const transaction = await require('../models').sequelize.transaction();
    try {
        // const today = 'Friday';
        const today = new Date().toISOString().slice(0, 10);
        const facultyProfile = await Faculty.findOne({ where: { userId: req.user.id } });
        const existingSubmission = await AttendanceSubmission.findOne({
            where: { date: today, timetableEntryId: timetableEntryId },
            transaction
        });
        if (existingSubmission) {
            await transaction.rollback();
            return res.status(403).json({ message: 'Attendance for this session has already been submitted and is locked.' });
        }
        const facultyCollegeId = req.user.collegeId;
        if (!facultyCollegeId) {
             await transaction.rollback();
             return res.status(403).json({ message: 'Faculty is not associated with a college.' });
        }
        const records = attendanceData.map(record => ({
            date: today, status: record.status, studentId: record.studentId,
            timetableEntryId: timetableEntryId, collegeId: facultyCollegeId,
        }));
        await Attendance.bulkCreate(records, { transaction });
        await AttendanceSubmission.create({
            date: today,
            timetableEntryId: timetableEntryId,
            facultyId: facultyProfile.id,
            collegeId: facultyCollegeId
        }, { transaction });
        await transaction.commit();
        res.status(201).json({ message: 'Attendance submitted successfully.' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Server Error' });
    }
};

const detectAnomalies = async (req, res) => {
    const { section } = req.body;
    if (!section) {
        return res.status(400).json({ message: "Section is required for anomaly detection." });
    }
    try {
        const students = await Student.findAll({ where: { section } });
        if (!students.length) {
            return res.status(200).json([{ studentName: "System", type: "Info", message: "No students found." }]);
        }
        const anomalies = [];
        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
        for (const student of students) {
            const history = await Attendance.findAll({ where: { studentId: student.id, date: { [Op.gte]: thirtyDaysAgo } } });
            if (history.length === 0) continue;
            const absentCount = history.filter(h => h.status === 'Absent').length;
            const lateCount = history.filter(h => h.status === 'Late').length;
            const presentCount = history.filter(h => h.status === 'Present' || h.status === 'Late').length;
            const totalClasses = history.length;
            const percentage = Math.round((presentCount / totalClasses) * 100);
            if (percentage < 50 && totalClasses > 0) {
                 anomalies.push({ studentName: student.name, type: 'Low Percentage', message: `Attendance is critically low at ${percentage}%.` });
            } else if (absentCount >= 3) {
                anomalies.push({ studentName: student.name, type: 'Frequent Absence', message: `Absent ${absentCount} times.` });
            }
            if (lateCount >= 3) {
                anomalies.push({ studentName: student.name, type: 'Frequent Lateness', message: `Late ${lateCount} times.` });
            }
        }
        if (anomalies.length === 0) {
            return res.status(200).json([{ studentName: "System", type: "No Anomalies", message: "No significant anomalies detected." }]);
        }
        res.status(200).json(anomalies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const checkIn = async (req, res) => {
    const { sessionId } = req.body; // Only the session ID is needed now

    if (!sessionId) {
        return res.status(400).json({ message: 'Session ID from QR code is required.' });
    }

    try {
        // 1. Find the student's profile
        const studentProfile = await Student.findOne({ where: { userId: req.user.id } });
        if (!studentProfile) {
            return res.status(404).json({ message: 'Your student profile could not be found.' });
        }

        // 2. Find the class session to ensure it exists
        const classSession = await TimetableEntry.findByPk(sessionId);
        if (!classSession) {
            return res.status(404).json({ message: 'The class session from the QR code is invalid.' });
        }

        // 3. Verify the student belongs to the section for this class
        if (studentProfile.section !== classSession.section) {
            return res.status(403).json({ message: 'Attendance denied. You are not enrolled in this class section.' });
        }

        // 4. Check if attendance has already been marked for this class today
        const today = new Date().toISOString().slice(0, 10);
        const [attendanceRecord, created] = await Attendance.findOrCreate({
            where: {
                date: today,
                studentId: studentProfile.id,
                timetableEntryId: sessionId
            },
            defaults: {
                status: 'Present',
                collegeId: studentProfile.collegeId,
            }
        });

        if (!created) {
            return res.status(409).json({ message: 'You have already checked in for this class.' });
        }

        res.status(201).json({ message: 'Attendance marked successfully!' });

    } catch (error) {
        console.error("FATAL ERROR in checkIn:", error);
        res.status(500).json({ message: "An unexpected server error occurred." });
    }
};

const getAttendanceForSession = async (req, res) => {
    try {
        const { timetableEntryId, date } = req.params;
        const records = await Attendance.findAll({ where: { timetableEntryId, date } });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { 
    getStudentsForAttendance, 
    submitAttendance, 
    detectAnomalies, 
    getAttendanceForSession,
    verifyAndSubmitAttendance ,
    checkIn
};