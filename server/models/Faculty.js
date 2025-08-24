
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Faculty = sequelize.define('Faculty', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // The simple unique rule
    },
    initials: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // The simple department string field is restored
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    collegeId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  });
  return Faculty;
};