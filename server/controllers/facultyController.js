const { sequelize, User, Faculty, College } = require('../models');

const getFaculty = async (req, res) => {
    try {
        const college = await College.findOne({ where: { adminId: req.user.id } });
        if (!college) {
            return res.status(404).json({ message: 'College not found for this admin.' });
        }

        const facultyMembers = await Faculty.findAll({
            where: { collegeId: college.id },
            include: [{ model: User, attributes: ['email'] }],
            order: [['name', 'ASC']]
        });

        res.status(200).json(facultyMembers);
    } catch (error) {
        console.error("Error fetching faculty:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createFaculty = async (req, res) => {
    const { name, email, employeeId, department, initials } = req.body;

    if (!name || !email || !employeeId || !department || !initials) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const transaction = await sequelize.transaction();

    try {
        const college = await College.findOne({ where: { adminId: req.user.id }, transaction });
        if (!college) {
            await transaction.rollback();
            return res.status(404).json({ message: 'College details must be set up first' });
        }

        const userExists = await User.findOne({ where: { email }, transaction });
        if (userExists) {
            await transaction.rollback();
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        // Note: These checks are now global, as per the reverted simple model
        const employeeIdExists = await Faculty.findOne({ where: { employeeId }, transaction });
        if (employeeIdExists) {
            await transaction.rollback();
            return res.status(400).json({ message: 'A faculty member with this Employee ID already exists.' });
        }

        const initialsExist = await Faculty.findOne({ where: { initials }, transaction });
        if (initialsExist) {
            await transaction.rollback();
            return res.status(400).json({ message: 'A faculty member with these initials already exists.' });
        }

        const password = Math.random().toString(36).slice(-8);

        const newUser = await User.create({
            email, password, role: 'Faculty', collegeId: college.id,
        }, { transaction });

        const newFaculty = await Faculty.create({
            name, employeeId, department, initials,
            userId: newUser.id, collegeId: college.id,
        }, { transaction });

        await transaction.commit();

        res.status(201).json({
            ...newFaculty.get(),
            email: newUser.email,
            tempPassword: password,
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error creating faculty:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteFaculty = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const faculty = await Faculty.findByPk(req.params.id, { transaction });
        if (!faculty) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const college = await College.findOne({ where: { adminId: req.user.id }, transaction });
        if (faculty.collegeId.toString() !== college.id.toString()) {
            await transaction.rollback();
            return res.status(403).json({ message: 'Not authorized to delete this faculty member' });
        }

        await User.destroy({ where: { id: faculty.userId }, transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Faculty member removed successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting faculty:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getFaculty, createFaculty, deleteFaculty };