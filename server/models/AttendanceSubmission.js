// File: server/models/AttendanceSubmission.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AttendanceSubmission = sequelize.define('AttendanceSubmission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    timetableEntryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    facultyId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    collegeId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    // Ensure that attendance for a class can only be submitted once per day
    indexes: [{
        unique: true,
        fields: ['date', 'timetableEntryId']
    }]
  });
  return AttendanceSubmission;
};