// File: server/models/College.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const College = sequelize.define('College', {
    // ... (existing fields)
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    affiliatedUniversity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: true, 
    },
    // --- NEW FIELD ---
    isSetupComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    geoLatitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    geoLongitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    geoRadius: { // Radius in meters
        type: DataTypes.INTEGER,
        allowNull: true,
    }
    // --- END OF NEW FIELD ---
  });
  return College;
};