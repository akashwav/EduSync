// File: server/models/Classroom.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Classroom = sequelize.define('Classroom', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roomNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Classroom', 'Lab'),
      allowNull: false,
      defaultValue: 'Classroom',
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    collegeId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  });
  return Classroom;
};