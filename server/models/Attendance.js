// File: server/models/Attendance.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM('Present', 'Absent', 'Late'), // Add 'Late'
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY, // Stores date as 'YYYY-MM-DD'
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    timetableEntryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
     collegeId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  });
  return Attendance;
};