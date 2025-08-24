import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import all pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import FacultyDashboardPage from './pages/FacultyDashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import SuperadminDashboardPage from './pages/SuperadminDashboardPage';
import LiveAttendancePage from './pages/LiveAttendancePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* --- PROTECTED ROUTES --- */}
          <Route path="/superadmin-dashboard" element={<ProtectedRoute><SuperadminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/faculty/*" element={<ProtectedRoute><FacultyDashboardPage /></ProtectedRoute>} />
          <Route path="/student/*" element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>} />
          <Route path="/live-attendance/:sessionId" element={<ProtectedRoute><LiveAttendancePage /></ProtectedRoute>} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;