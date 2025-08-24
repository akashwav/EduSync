// File: server/models/Subject.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subject = sequelize.define('Subject', {
    // ... (existing fields: id, semester, etc.)
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subjectType: {
      type: DataTypes.ENUM('Theory', 'Lab'),
      allowNull: false,
    },
    subjectCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subjectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creditPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    classesPerWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    // --- NEW FIELD ---
    priority: {
      type: DataTypes.ENUM('Major', 'Minor', 'Interdisciplinary', 'Value Added'),
      allowNull: false,
      defaultValue: 'Major',
    },
    // --- END OF NEW FIELD ---
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  });
  return Subject;
};