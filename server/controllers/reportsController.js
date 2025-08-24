// File: server/controllers/reportsController.js

const { Student, Subject, Course, Attendance, TimetableEntry } = require('../models');
const { Parser } = require('json2csv'); // Import the json2csv Parser

// ... (The existing getDefaulterList function remains unchanged)
const getDefaulterList = async (req, res) => {
    try {
        const threshold = parseInt(req.params.threshold, 10);
        if (isNaN(threshold) || threshold < 0 || threshold > 100) {
            return res.status(400).json({ message: 'Invalid threshold percentage provided.' });
        }

        const collegeId = req.user.collegeId;
        if (!collegeId) {
            return res.status(403).json({ message: 'Admin not associated with a college.' });
        }

        const allStudents = await Student.findAll({ where: { collegeId } });
        const defaulterList = [];

        for (const student of allStudents) {
            const courseAbbr = student.section.match(/[a-zA-Z]+/)[0];
            const semester = parseInt(student.section.match(/\d+/)[0], 10);
            const course = await Course.findOne({ where: { abbreviation: courseAbbr, collegeId } });
            if (!course) continue;

            const subjects = await Subject.findAll({
                where: { courseId: course.id, semester: semester }
            });

            const studentDefaulterInfo = {
                studentId: student.id,
                name: student.name,
                rollNumber: student.rollNumber,
                section: student.section,
                defaulterSubjects: []
            };

            for (const subject of subjects) {
                const classSessions = await TimetableEntry.findAll({
                    where: { subjectId: subject.id, section: student.section },
                    attributes: ['id']
                });
                const sessionIds = classSessions.map(s => s.id);

                if (sessionIds.length > 0) {
                    const totalClasses = await Attendance.count({
                        where: { studentId: student.id, timetableEntryId: sessionIds }
                    });
                    const presentClasses = await Attendance.count({
                        where: { studentId: student.id, timetableEntryId: sessionIds, status: 'Present' }
                    });

                    if (totalClasses > 0) {
                        const percentage = Math.round((presentClasses / totalClasses) * 100);
                        if (percentage < threshold) {
                            studentDefaulterInfo.defaulterSubjects.push({
                                subjectName: subject.subjectName,
                                subjectCode: subject.subjectCode,
                                percentage: percentage
                            });
                        }
                    }
                }
            }

            if (studentDefaulterInfo.defaulterSubjects.length > 0) {
                defaulterList.push(studentDefaulterInfo);
            }
        }

        res.status(200).json(defaulterList);

    } catch (error) {
        console.error("Error generating defaulter list:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// --- NEW FUNCTION ---
// @desc    Download a CSV of students with attendance below a certain threshold
// @route   GET /api/reports/defaulters/download/:threshold
// @access  Private (Admin)
const downloadDefaulterList = async (req, res) => {
    try {
        const threshold = parseInt(req.params.threshold, 10);
        const collegeId = req.user.collegeId;

        // (The data fetching logic is the same as getDefaulterList)
        const allStudents = await Student.findAll({ where: { collegeId } });
        const defaulterList = [];
        for (const student of allStudents) {
            // ... (omitted for brevity - same logic as above)
            const courseAbbr = student.section.match(/[a-zA-Z]+/)[0];
            const semester = parseInt(student.section.match(/\d+/)[0], 10);
            const course = await Course.findOne({ where: { abbreviation: courseAbbr, collegeId } });
            if (!course) continue;
            const subjects = await Subject.findAll({ where: { courseId: course.id, semester: semester } });
            for (const subject of subjects) {
                const classSessions = await TimetableEntry.findAll({ where: { subjectId: subject.id, section: student.section }, attributes: ['id'] });
                const sessionIds = classSessions.map(s => s.id);
                if (sessionIds.length > 0) {
                    const totalClasses = await Attendance.count({ where: { studentId: student.id, timetableEntryId: sessionIds } });
                    const presentClasses = await Attendance.count({ where: { studentId: student.id, timetableEntryId: sessionIds, status: 'Present' } });
                    if (totalClasses > 0) {
                        const percentage = Math.round((presentClasses / totalClasses) * 100);
                        if (percentage < threshold) {
                            // Flatten the data for CSV
                            defaulterList.push({
                                studentName: student.name,
                                rollNumber: student.rollNumber,
                                section: student.section,
                                subjectName: subject.subjectName,
                                subjectCode: subject.subjectCode,
                                attendancePercentage: percentage
                            });
                        }
                    }
                }
            }
        }

        if (defaulterList.length === 0) {
            return res.status(404).json({ message: 'No defaulters found to download.' });
        }

        // Define CSV fields and convert data
        const fields = ['studentName', 'rollNumber', 'section', 'subjectName', 'subjectCode', 'attendancePercentage'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(defaulterList);

        // Set headers to trigger browser download
        res.header('Content-Type', 'text/csv');
        res.attachment(`defaulter-report-${new Date().toISOString().slice(0, 10)}.csv`);
        res.send(csv);

    } catch (error) {
        console.error("Error downloading defaulter list:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


module.exports = { getDefaulterList, downloadDefaulterList }; // Export the new function