// File: server/services/timetableGenerator.js

const { Course, Subject, Faculty, Classroom, TimetableEntry, Attendance, AttendanceSubmission } = require('../models');

// Helper function to shuffle an array for randomness
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class TimetableGenerator {
    constructor(collegeId) {
        this.collegeId = collegeId;
        this.scheduleGrid = {};
        this.timeSlots = [
            { day: 'Monday', start: '09:15', end: '10:10' }, { day: 'Monday', start: '10:10', end: '11:05' },
            { day: 'Monday', start: '11:05', end: '12:00' }, { day: 'Monday', start: '12:40', end: '13:35' },
            { day: 'Monday', start: '13:35', end: '14:30' }, { day: 'Monday', start: '14:30', end: '15:20' },
            { day: 'Monday', start: '15:20', end: '16:10' }, { day: 'Monday', start: '16:10', end: '17:00' },
            ...['Tuesday', 'Wednesday', 'Thursday', 'Friday'].flatMap(day => [
                { day, start: '09:15', end: '10:10' }, { day, start: '10:10', end: '11:05' },
                { day, start: '11:05', end: '12:00' }, { day, start: '12:40', end: '13:35' },
                { day, start: '13:35', end: '14:30' }, { day, start: '14:30', end: '15:20' },
                { day, start: '15:20', end: '16:10' }, { day, start: '16:10', end: '17:00' },
            ])
        ];
    }

    initializeSchedule() {
        this.timeSlots.forEach(slot => {
            const key = `${slot.day}-${slot.start}`;
            this.scheduleGrid[key] = { facultyIds: new Set(), classroomIds: new Set(), sections: new Set() };
        });
    }

    async generate() {
        this.initializeSchedule();

        const [courses, allSubjects, allFaculty, allClassrooms] = await Promise.all([
            Course.findAll({ where: { collegeId: this.collegeId } }),
            Subject.findAll({ include: [{ model: Course, where: { collegeId: this.collegeId } }] }),
            Faculty.findAll({ where: { collegeId: this.collegeId } }),
            Classroom.findAll({ where: { collegeId: this.collegeId } })
        ]);

        const sections = [];
        courses.forEach(course => {
            for (let sem = 1; sem <= course.totalSemesters; sem += 2) { // Assuming odd semesters for now
                sections.push(`${course.abbreviation} ${sem}A`);
                sections.push(`${course.abbreviation} ${sem}B`);
            }
        });

        const theoryRooms = allClassrooms.filter(c => c.type === 'Classroom');
        const labRooms = allClassrooms.filter(c => c.type === 'Lab');
        const sectionHomeRooms = {};
        if (theoryRooms.length > 0) {
            sections.forEach((section, index) => {
                sectionHomeRooms[section] = theoryRooms[index % theoryRooms.length];
            });
        }

        const facultyByDept = allFaculty.reduce((acc, fac) => {
            const deptKey = fac.department.replace(/\s/g, '').toUpperCase();
            (acc[deptKey] = acc[deptKey] || []).push(fac);
            return acc;
        }, {});

        await Attendance.destroy({ where: { collegeId: this.collegeId } });
        await AttendanceSubmission.destroy({ where: { collegeId: this.collegeId } });
        await TimetableEntry.destroy({ where: { collegeId: this.collegeId } });

        const generatedEntries = [];
        const classCount = {}; // Tracks count for each subject per section
        const teacherSubjectCount = {}; // Tracks subjects per teacher per section

        // --- PHASE 1: PLACE LIBRARY HOURS (AFTER LUNCH) ---
        const afterLunchSlots = this.timeSlots.filter(slot => parseInt(slot.start.split(':')[0], 10) >= 12);
        for (const section of sections) {
            for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
                let placed = false;
                for (const slot of shuffleArray([...afterLunchSlots])) { // Shuffle for variety
                    if (slot.day === day) {
                        const key = `${slot.day}-${slot.start}`;
                        const slotInfo = this.scheduleGrid[key];
                        const homeRoom = sectionHomeRooms[section];
                        if (homeRoom && !slotInfo.sections.has(section) && !slotInfo.classroomIds.has(homeRoom.id)) {
                            slotInfo.sections.add(section);
                            slotInfo.classroomIds.add(homeRoom.id);
                            generatedEntries.push({
                                section, dayOfWeek: slot.day, startTime: `${slot.start}:00`, endTime: `${slot.end}:00`,
                                classroomId: homeRoom.id, subjectId: null, facultyId: null,
                                courseId: courses.find(c => section.startsWith(c.abbreviation))?.id,
                                collegeId: this.collegeId,
                            });
                            placed = true;
                            break;
                        }
                    }
                }
            }
        }

        // --- PHASE 2: PRIORITY SCHEDULING ---
        const priorityOrder = ['Major', 'Minor', 'Interdisciplinary', 'Value Added'];
        for (const priority of priorityOrder) {
            for (const section of sections) {
                const courseAbbr = section.match(/[a-zA-Z]+/)[0];
                const semester = parseInt(section.match(/\d+/)[0], 10);
                const course = courses.find(c => c.abbreviation === courseAbbr);
                if (!course) continue;

                const subjectsForSection = allSubjects.filter(s => s.courseId === course.id && s.semester === semester && s.priority === priority);

                for (const subject of subjectsForSection) {
                    for (let i = 0; i < subject.classesPerWeek; i++) {
                        const lookupKey = course.abbreviation.replace(/\s/g, '').toUpperCase();
                        const potentialFaculty = facultyByDept[lookupKey] || [];
                        this.placeClass(section, subject, shuffleArray([...potentialFaculty]), sectionHomeRooms, labRooms, generatedEntries, classCount, teacherSubjectCount);
                    }
                }
            }
        }

        // --- PHASE 3: SMART FILLER LOOP ---
        for (const slot of this.timeSlots) {
            for (const section of sections) {
                const key = `${slot.day}-${slot.start}`;
                if (this.scheduleGrid[key].sections.has(section)) continue;

                const courseAbbr = section.match(/[a-zA-Z]+/)[0];
                const semester = parseInt(section.match(/\d+/)[0], 10);
                const course = courses.find(c => c.abbreviation === courseAbbr);
                if (!course) continue;

                const subjectsForSection = allSubjects.filter(s => s.courseId === course.id && s.semester === semester);
                subjectsForSection.sort((a, b) => (classCount[`${section}-${a.id}`] || 0) - (classCount[`${section}-${b.id}`] || 0));

                for (const subject of subjectsForSection) {
                    const countKey = `${section}-${subject.id}`;
                    if ((classCount[countKey] || 0) >= 4) continue;
                    
                    const lookupKey = course.abbreviation.replace(/\s/g, '').toUpperCase();
                    const potentialFaculty = facultyByDept[lookupKey] || [];
                    if (this.placeClass(section, subject, shuffleArray([...potentialFaculty]), sectionHomeRooms, labRooms, generatedEntries, classCount, teacherSubjectCount)) {
                        break;
                    }
                }
            }
        }

        await TimetableEntry.bulkCreate(generatedEntries);
        return { success: true, message: `Generated ${generatedEntries.length} timetable entries.` };
    }

    placeClass(section, subject, potentialFaculty, sectionHomeRooms, labRooms, generatedEntries, classCount, teacherSubjectCount) {
        for (const faculty of potentialFaculty) {
            const teacherSectionKey = `${faculty.id}-${section}`;
            const subjectSet = teacherSubjectCount[teacherSectionKey] || new Set();
            if (subjectSet.size >= 2 && !subjectSet.has(subject.id)) {
                continue;
            }

            const homeRoom = sectionHomeRooms[section];
            if (subject.subjectType === 'Theory' && !homeRoom) continue;

            const classroomPool = subject.subjectType === 'Lab' ? labRooms : [homeRoom];

            for (const classroom of classroomPool) {
                for (const slot of this.timeSlots) {
                    const key = `${slot.day}-${slot.start}`;
                    const slotInfo = this.scheduleGrid[key];

                    if (!slotInfo.facultyIds.has(faculty.id) && !slotInfo.sections.has(section) && !slotInfo.classroomIds.has(classroom.id)) {
                        slotInfo.facultyIds.add(faculty.id);
                        slotInfo.sections.add(section);
                        slotInfo.classroomIds.add(classroom.id);

                        teacherSubjectCount[teacherSectionKey] = subjectSet.add(subject.id);

                        generatedEntries.push({
                            section, dayOfWeek: slot.day, startTime: `${slot.start}:00`, endTime: `${slot.end}:00`,
                            classroomId: classroom.id, subjectId: subject.id, facultyId: faculty.id,
                            courseId: subject.Course.id, collegeId: this.collegeId,
                        });

                        const countKey = `${section}-${subject.id}`;
                        classCount[countKey] = (classCount[countKey] || 0) + 1;
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

module.exports = TimetableGenerator;
