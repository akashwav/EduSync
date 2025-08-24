// File: server/models/Student.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Student = sequelize.define('Student', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false, unique: true },
    collegeId: { type: DataTypes.UUID, allowNull: false }
  }, {
    // --- THIS IS THE FIX ---
    // The 'indexes' property should be an array of objects.
    indexes: [
      {
        unique: true,
        fields: ['rollNumber', 'collegeId']
      }
    ]
    // --- END OF FIX ---
  });
  return Student;
};