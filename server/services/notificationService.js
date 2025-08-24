// File: server/services/notificationService.js

const nodemailer = require('nodemailer');
const { Student, Subject, Course, Attendance, TimetableEntry, User } = require('../models');

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'haylie.heaney45@ethereal.email',
        pass: 'k9YgtNfyMzN1JV2unw'
    }
});

const sendLowAttendanceAlerts = async (collegeId, threshold) => {
    try {
        const allStudents = await Student.findAll({ 
            where: { collegeId },
            include: [{ model: User, attributes: ['email'] }]
        });

        let emailsSent = 0;
        let lastEmailInfo = null; // To store info for the preview URL

        for (const student of allStudents) {
            const courseAbbr = student.section.match(/[a-zA-Z]+/)[0];
            const semester = parseInt(student.section.match(/\d+/)[0], 10);
            const course = await Course.findOne({ where: { abbreviation: courseAbbr, collegeId } });
            if (!course) continue;

            const subjects = await Subject.findAll({
                where: { courseId: course.id, semester: semester }
            });

            let defaulterSubjects = [];

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
                            defaulterSubjects.push({
                                subjectName: subject.subjectName,
                                percentage: percentage
                            });
                        }
                    }
                }
            }

            if (defaulterSubjects.length > 0) {
                const subjectList = defaulterSubjects.map(s => `<li>${s.subjectName}: <strong>${s.percentage}%</strong></li>`).join('');

                const mailOptions = {
                    from: '"EduSync System" <noreply@edusync.com>',
                    to: student.User.email,
                    subject: 'Low Attendance Warning',
                    html: `
                        <p>Dear ${student.name},</p>
                        <p>This is a warning regarding your low attendance. Your attendance in the following subject(s) is below the required ${threshold}%:</p>
                        <ul>${subjectList}</ul>
                        <p>Please ensure you attend all future classes to avoid academic penalties.</p>
                        <p>Regards,<br/>The Heritage Academy</p>
                    `
                };

                // --- THIS IS THE FIX ---
                // Send the email and store the result
                lastEmailInfo = await transporter.sendMail(mailOptions);
                // --- END OF FIX ---
                emailsSent++;
            }
        }
        
        // Log the preview URL of the *last* email that was sent
        if (lastEmailInfo) {
            console.log(`Preview URL for test emails: ${nodemailer.getTestMessageUrl(lastEmailInfo)}`);
        }

        return { success: true, message: `Process complete. ${emailsSent} warning emails sent.` };

    } catch (error) {
        console.error("Error in notification service:", error);
        return { success: false, message: "Failed to send notifications." };
    }
};

module.exports = { sendLowAttendanceAlerts };


