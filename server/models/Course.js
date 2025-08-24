const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalSemesters: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    collegeId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  });
  return Course;
};