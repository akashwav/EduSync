// File: server/controllers/manualEditController.js

const { TimetableEntry } = require('../models');
const { Op } = require('sequelize');

const updateTimetableEntry = async (req, res) => {
    const { entryId } = req.params;
    const { newDay, newStartTime, newEndTime } = req.body;

    if (!newDay || !newStartTime || !newEndTime) {
        return res.status(400).json({ message: 'New day and start/end times are required.' });
    }

    try {
        // 1. Find the class entry we want to move.
        const entryToMove = await TimetableEntry.findByPk(entryId);
        if (!entryToMove) {
            return res.status(404).json({ message: 'Timetable entry not found.' });
        }

        // 2. Find all existing entries at the new target time slot.
        // We exclude the entry we are currently moving from this check.
        const conflictsAtDestination = await TimetableEntry.findAll({
            where: {
                dayOfWeek: newDay,
                startTime: newStartTime,
                id: { [Op.ne]: entryId } 
            }
        });

        // 3. Perform a more robust and intelligent validation.
        
        // --- SECTION CONFLICT CHECK ---
        // Is the section of the class we are moving already busy at the new time?
        const sectionIsBusy = conflictsAtDestination.some(
            conflict => conflict.section === entryToMove.section
        );
        if (sectionIsBusy) {
            return res.status(409).json({ 
                message: `Conflict: Section ${entryToMove.section} already has a class scheduled at this time.` 
            });
        }

        // --- FACULTY & CLASSROOM CONFLICT CHECK (for non-library hours) ---
        // We only perform these checks if the entry being moved is an actual class (not a library hour).
        if (entryToMove.subjectId !== null) {
            // Is the assigned faculty member already teaching another class at the new time?
            const facultyIsBusy = conflictsAtDestination.some(
                conflict => conflict.facultyId === entryToMove.facultyId
            );
            if (facultyIsBusy) {
                return res.status(409).json({ 
                    message: `Conflict: The assigned faculty is already teaching another class at this time.` 
                });
            }

            // Is the assigned classroom already in use by another class at the new time?
            const classroomIsBusy = conflictsAtDestination.some(
                conflict => conflict.classroomId === entryToMove.classroomId
            );
            if (classroomIsBusy) {
                return res.status(409).json({ 
                    message: `Conflict: Classroom is already in use by another section at this time.` 
                });
            }
        }

        // 4. If all checks pass and no conflicts are found, update the entry.
        entryToMove.dayOfWeek = newDay;
        entryToMove.startTime = newStartTime;
        entryToMove.endTime = newEndTime;
        await entryToMove.save();

        res.status(200).json({ message: 'Timetable updated successfully.', updatedEntry: entryToMove });

    } catch (error) {
        console.error("Error updating timetable entry:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { updateTimetableEntry };
