// File: server/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');

const { connectDB } = require('./config/database');
const db = require('./models'); // This now imports the fully configured db object
const timetableRoutes = require('./routes/timetableRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const facultyDashboardRoutes = require('./routes/facultyDashboardRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const studentDashboardRoutes = require('./routes/studentDashboardRoutes');
const reportsRoutes = require('./routes/reportsRoutes'); 
const notificationRoutes = require('./routes/notificationRoutes');
const manualEditRoutes = require('./routes/manualEditRoutes');
const superadminRoutes = require('./routes/superadminRoutes'); 
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const adminActionsRoutes = require('./routes/adminActionsRoutes');
const classroomAssignmentRoutes = require('./routes/classroomAssignmentRoutes');
const geofenceRoutes = require('./routes/geofenceRoutes');
const qrRoutes = require('./routes/qrRoutes'); 

process.on('unhandledRejection', (reason, promise) => {
  console.error('!!! UNHANDLED REJECTION AT:', promise, 'REASON:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('!!! UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

// --- Main Application Function ---
const startApp = async () => {
  try {
    // 1. First, connect to the database.
    await connectDB();
    console.log('✅ Database connection successful.');

    // 2. Then, sync all models. This ensures all tables and associations are ready.
    await db.sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');

    // 3. NOW, create the Express app.
    const app = express();
    const server = http.createServer(app);

     // This middleware is essential. It tells Express how to read the JSON data
    // sent from your frontend forms. It MUST come before your routes.
    
    const corsOptions = {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"]
    };
    app.use(cors(corsOptions));
    
    // 5. Set up the WebSocket (socket.io) server
    const io = new Server(server, { cors: corsOptions });
    app.set('io', io); // Make the 'io' instance available to our controllers
    
    io.on('connection', (socket) => {
      console.log('A user connected via WebSocket:', socket.id);
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
    
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 5. Define API routes AFTER the database is ready.
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/college', require('./routes/collegeRoutes'));
    app.use('/api/courses', require('./routes/courseRoutes'));
    app.use('/api/faculty', require('./routes/facultyRoutes'));
    app.use('/api/students', require('./routes/studentRoutes'));
    app.use('/api/subjects', require('./routes/subjectApiRoutes'));
    app.use('/api/timetable', timetableRoutes);
    app.use('/api/classrooms', classroomRoutes);
    app.use('/api/faculty-dashboard', facultyDashboardRoutes);
    app.use('/api/attendance', attendanceRoutes); 
    app.use('/api/student-dashboard', studentDashboardRoutes);
    app.use('/api/reports', reportsRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/timetable/edit', manualEditRoutes); 
    app.use('/api/superadmin', superadminRoutes);
    app.use('/api/admin-dashboard', adminDashboardRoutes);
    app.use('/api/password', passwordResetRoutes);
    app.use('/api/admin-actions', adminActionsRoutes); 
    app.use('/api/classroom-assignments', classroomAssignmentRoutes);
    app.use('/api/geofence', geofenceRoutes);


    app.get('/api/health', (req, res) => {
      res.status(200).json({ message: 'Server is up and running!' });
    });

    // 6. Start the server.
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

// --- Run the Application ---
startApp();