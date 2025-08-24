// File: server/models/TimetableEntry.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TimetableEntry = sequelize.define('TimetableEntry', {
    // ... (id, section, etc. remain the same)
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // --- THIS IS THE FIX ---
    dayOfWeek: {
      // Add Saturday and Sunday to the list of allowed values
      type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
      allowNull: false,
    },
    // --- END OF FIX ---
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    classroomId: { type: DataTypes.UUID, allowNull: false },
    subjectId: { type: DataTypes.UUID, allowNull: true },
    facultyId: { type: DataTypes.UUID, allowNull: true },
    courseId: { type: DataTypes.UUID, allowNull: false },
    collegeId: { type: DataTypes.UUID, allowNull: false },
  });
  return TimetableEntry;
};