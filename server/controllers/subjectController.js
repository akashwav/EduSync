// File: server/controllers/subjectController.js

const { Subject, Course, College } = require('../models');

// ... (getAllSubjectsForAdmin and getSubjectsByCourse functions remain the same)
const getAllSubjectsForAdmin = async (req, res) => {
    try {
        const college = await College.findOne({ where: { adminId: req.user.id } });
        if (!college) return res.status(404).json({ message: 'College not found' });

        const courses = await Course.findAll({ where: { collegeId: college.id }, attributes: ['id'] });
        const courseIds = courses.map(c => c.id);

        const subjects = await Subject.findAll({
            where: { courseId: courseIds },
            include: [{ model: Course, attributes: ['abbreviation'] }],
            order: [['subjectName', 'ASC']]
        });

        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getSubjectsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const subjects = await Subject.findAll({
      where: { courseId },
      order: [['semester', 'ASC'], ['subjectName', 'ASC']],
    });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


const addSubject = async (req, res) => {
  const { courseId } = req.params;
  // Add 'priority' to the destructuring
  const { semester, subjectType, subjectCode, subjectName, creditPoint, classesPerWeek, priority } = req.body;

  // Add validation for the new fields
  if (!semester || !subjectType || !subjectCode || !subjectName || !creditPoint || !classesPerWeek || !priority) {
    return res.status(400).json({ message: 'Please provide all required subject details' });
  }

  try {
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const college = await College.findOne({ where: { adminId: req.user.id } });
    if (course.collegeId.toString() !== college.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add subjects to this course' });
    }

    const newSubject = await Subject.create({
      courseId,
      semester,
      subjectType,
      subjectCode,
      subjectName,
      creditPoint,
      classesPerWeek,
      priority, // Save the new field
    });

    res.status(201).json(newSubject);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: `A subject with code '${subjectCode}' already exists.` });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getSubjectsByCourse,
  addSubject,
  getAllSubjectsForAdmin,
};