// File: server/controllers/classroomAssignmentController.js

const { Course, Classroom } = require('../models');

// @desc    Get the list of home classroom assignments for all sections
// @route   GET /api/classroom-assignments
// @access  Private (Admin)
const getClassroomAssignments = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        if (!collegeId) {
            return res.status(403).json({ message: 'Admin not associated with a college.' });
        }

        const [courses, theoryRooms] = await Promise.all([
            Course.findAll({ where: { collegeId } }),
            Classroom.findAll({ where: { collegeId, type: 'Classroom' }, order: [['roomNumber', 'ASC']] })
        ]);

        if (theoryRooms.length === 0) {
            return res.status(200).json([]); // Return empty if no theory rooms are defined
        }

        const sections = [];
        courses.forEach(course => {
            // We'll generate for all semesters for a complete view
            for (let sem = 1; sem <= course.totalSemesters; sem++) {
                sections.push(`${course.abbreviation} ${sem}A`);
                sections.push(`${course.abbreviation} ${sem}B`);
            }
        });

        const assignments = sections.map((section, index) => {
            // Assign rooms in a repeating cycle
            const assignedRoom = theoryRooms[index % theoryRooms.length];
            return {
                id: section, // Use section name as a unique key for the list
                section: section,
                roomNumber: assignedRoom.roomNumber,
                capacity: assignedRoom.capacity
            };
        });

        res.status(200).json(assignments);

    } catch (error) {
        console.error("Error fetching classroom assignments:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getClassroomAssignments };