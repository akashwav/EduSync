// File: server/config/database.js

const { Sequelize } = require('sequelize');
require('dotenv').config(); // Loads environment variables from .env file

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, // Set to console.log to see raw SQL queries
  }
);

// Function to test the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Database connection has been established successfully.');
  } catch (error)
  {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };