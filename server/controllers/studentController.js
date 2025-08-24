// File: server/controllers/studentController.js

const { sequelize, User, Student, College } = require('../models');

const generateRandomPassword = () => Math.random().toString(36).slice(-8);

// @desc    Get all students for the admin's college
// @route   GET /api/students
// @access  Private (Admin)
const getStudents = async (req, res) => {
  try {
    const college = await College.findOne({ where: { adminId: req.user.id } });
    if (!college) return res.status(404).json({ message: 'College not found' });

    const students = await Student.findAll({
      where: { collegeId: college.id },
      include: [{ model: User, attributes: ['email'] }],
      order: [['name', 'ASC']]
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res) => {
  const { name, email, rollNumber, section } = req.body;

  if (!name || !email || !rollNumber || !section) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const transaction = await sequelize.transaction();

  try {
    const college = await College.findOne({ where: { adminId: req.user.id } });
    if (!college) {
      await transaction.rollback();
      return res.status(404).json({ message: 'College details must be set up first' });
    }

    // Check for existing user, roll number
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        await transaction.rollback();
        return res.status(400).json({ message: 'A user with this email already exists.' });
    }
    const rollNumberExists = await Student.findOne({ where: { rollNumber, collegeId: college.id }, transaction });
        // --- END OF FIX ---
        if (rollNumberExists) {
            await transaction.rollback();
            return res.status(400).json({ message: 'A student with this Roll Number already exists in your college.' });
        }

    const password = generateRandomPassword();

    // 1. Create User account
    const newUser = await User.create({
      email,
      password,
      role: 'Student',
      collegeId: college.id,
    }, { transaction });

    // 2. Create Student profile
    const newStudent = await Student.create({
      name,
      rollNumber,
      section,
      userId: newUser.id,
      collegeId: college.id,
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      ...newStudent.get(),
      email: newUser.email,
      tempPassword: password,
    });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Server Error' });
  }
};
const deleteStudent = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const student = await Student.findByPk(req.params.id, { transaction });
        if (!student) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Student not found' });
        }

        // Authorization check
        const college = await College.findOne({ where: { adminId: req.user.id }, transaction });
        if (student.collegeId.toString() !== college.id.toString()) {
            await transaction.rollback();
            return res.status(403).json({ message: 'Not authorized to delete this student' });
        }

        // Delete the associated user account
        await User.destroy({ where: { id: student.userId }, transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Student removed successfully' });
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError' && error.message.includes('rollNumber')) {
            return res.status(400).json({ message: `A student with Roll Number '${rollNumber}' already exists in your college.` });
        }
        console.error("Error deleting student:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getStudents, createStudent, deleteStudent };