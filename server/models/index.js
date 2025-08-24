// File: server/models/index.js

const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

const db = {};

// Read all files in the current directory (models) except for this index.js file
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js')
  .forEach(file => {
    // Import the model definition function and call it with the sequelize instance
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

// Now that all models are loaded into the 'db' object, we can define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// --- DEFINE ALL ASSOCIATIONS HERE ---

const { User, College, Course, Subject, Faculty, Student, Classroom, TimetableEntry, Attendance, AttendanceSubmission } = db;
// User <-> College
User.hasOne(College, { foreignKey: 'adminId', as: 'AdminCollege' });
College.belongsTo(User, { as: 'Admin', foreignKey: 'adminId' });
College.hasMany(User, { foreignKey: 'collegeId' });
User.belongsTo(College, { foreignKey: 'collegeId' });

// College <-> Course
College.hasMany(Course, { foreignKey: 'collegeId', onDelete: 'CASCADE' });
Course.belongsTo(College, { foreignKey: 'collegeId' });

// Course <-> Subject
Course.hasMany(Subject, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Subject.belongsTo(Course, { foreignKey: 'courseId' });

// User <-> Faculty
User.hasOne(Faculty, { foreignKey: 'userId', onDelete: 'CASCADE' });
Faculty.belongsTo(User, { foreignKey: 'userId' });

// User <-> Student
User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

// College <-> Classroom (One-to-Many)
College.hasMany(Classroom, { foreignKey: 'collegeId', onDelete: 'CASCADE' });
Classroom.belongsTo(College, { foreignKey: 'collegeId' });


TimetableEntry.belongsTo(Classroom, { foreignKey: 'classroomId' });
TimetableEntry.belongsTo(Subject, { foreignKey: 'subjectId' });
TimetableEntry.belongsTo(Faculty, { foreignKey: 'facultyId' });
TimetableEntry.belongsTo(Course, { foreignKey: 'courseId' });
TimetableEntry.belongsTo(College, { foreignKey: 'collegeId' });

// --- NEW ASSOCIATIONS for Attendance ---
Attendance.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Attendance, { foreignKey: 'studentId' });

Attendance.belongsTo(TimetableEntry, { foreignKey: 'timetableEntryId' });
TimetableEntry.hasMany(Attendance, { foreignKey: 'timetableEntryId' });

Attendance.belongsTo(College, { foreignKey: 'collegeId' });
College.hasMany(Attendance, { foreignKey: 'collegeId' });

AttendanceSubmission.belongsTo(TimetableEntry, { foreignKey: 'timetableEntryId' });

College.hasMany(Course, { foreignKey: 'collegeId', onDelete: 'CASCADE' });
Course.belongsTo(College, { foreignKey: 'collegeId' });

// Course <-> TimetableEntry (One-to-Many) - This was the missing link
Course.hasMany(TimetableEntry, { foreignKey: 'courseId', onDelete: 'CASCADE' });
TimetableEntry.belongsTo(Course, { foreignKey: 'courseId' });



db.sequelize = sequelize;

module.exports = db;