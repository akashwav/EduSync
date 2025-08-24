// File: server/models/User.js

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = (sequelize) => {
  class User extends Model {
    async isValidPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    getResetPasswordToken() {
        const resetToken = crypto.randomBytes(20).toString('hex');
        this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        return resetToken;
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Faculty', 'Student', 'Superadmin'),
      allowNull: false,
    },
    collegeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpire: {
        type: DataTypes.DATE,
        allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // --- THIS IS THE FIX ---
      // This hook runs whenever a user record is updated.
      beforeUpdate: async (user) => {
        // We only hash the password if it has been changed.
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
      // --- END OF FIX ---
    },
  });

  return User;
};