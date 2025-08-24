// File: server/controllers/classroomController.js

const { College, Classroom } = require('../models');

const getClassrooms = async (req, res) => {
  try {
    const college = await College.findOne({ where: { adminId: req.user.id } });
    const classrooms = await Classroom.findAll({ where: { collegeId: college.id } });
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createClassroom = async (req, res) => {
  const { roomNumber, type, capacity } = req.body;
  try {
    const college = await College.findOne({ where: { adminId: req.user.id } });
    const newClassroom = await Classroom.create({ roomNumber, type, capacity, collegeId: college.id });
    res.status(201).json(newClassroom);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
const deleteClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findByPk(req.params.id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Authorization check
        const college = await College.findOne({ where: { adminId: req.user.id } });
        if (classroom.collegeId.toString() !== college.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this classroom' });
        }

        await classroom.destroy();
        res.status(200).json({ message: 'Classroom removed successfully' });
    } catch (error) {
        console.error("Error deleting classroom:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getClassrooms, createClassroom, deleteClassroom };