// File: server/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const { connectDB } = require('./config/database');
const db = require('./models'); // Sequelize models + sequelize instance

// --- Routes ---
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
const qrRoutes = require('./routes/qrRoutes'); // you had this imported; now it's mounted too

// ---- Global process error guards ----
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
    // 1) Connect to DB
    await connectDB();
    console.log('✅ Database connection successful.');

    // 2) Sync all models (fixes "sync is not defined")
    await db.sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');

    // 3) Create Express app + HTTP server (for socket.io)
    const app = express();
    const server = http.createServer(app);

    // 4) CORS
    // Put your deployed frontend URL in .env as: CLIENT_URL=https://edu-sync-flame.vercel.app
    const allowedOrigins = [
      'http://localhost:5173',
      process.env.CLIENT_URL
    ].filter(Boolean); // remove undefined

    const corsOptions = {
      origin: (origin, callback) => {
        // allow REST tools / mobile apps / SSR with no origin
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };

    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions)); // handle preflight

    // 5) Socket.io (attach to the same HTTP server)
    const io = new Server(server, { cors: corsOptions });
    app.set('io', io);
    io.on('connection', (socket) => {
      console.log('A user connected via WebSocket:', socket.id);
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    // 6) Body parsers
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 7) Routes
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
    app.use('/api/qr', qrRoutes); // ✅ mounted now

    // Simple health check
    app.get('/api/health', (req, res) => {
      res.status(200).json({ message: 'Server is up and running!' });
    });

    // 8) Start server (IMPORTANT: use server.listen, not app.listen)
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

// --- Run the Application ---
startApp();
