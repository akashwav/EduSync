// File: client/src/pages/AdminDashboardPage.jsx

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminOverview from '../components/AdminOverview';
import CourseManagement from '../components/CourseManagement';
import FacultyManagement from '../components/FacultyManagement';
import StudentManagement from '../components/StudentManagement';
import ClassroomManagement from '../components/ClassroomManagement';
import ClassroomAssignmentsPage from '../components/ClassroomAssignmentsPage';
import ReportsPage from '../components/ReportsPage';
import TimetableView from '../components/TimetableView';
import GenerateTimetablePage from '../components/GenerateTimetablePage';
import GeofencePage from '../components/GeofencePage'; // Make sure this import is correct

const AdminDashboardPage = () => {
  const location = useLocation();

  const getHeaderTitle = (pathname) => {
    const parts = pathname.split('/').filter(Boolean);
    const title = parts[parts.length - 1] || 'Dashboard';
    return title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const title = getHeaderTitle(location.pathname);

  return (
    <AdminLayout headerTitle={title}>
      <Routes>
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="faculty" element={<FacultyManagement />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="classrooms" element={<ClassroomManagement />} />
        <Route path="classroom-assignments" element={<ClassroomAssignmentsPage />} />
        <Route path="generate-timetable" element={<GenerateTimetablePage />} />
        <Route path="view-timetable" element={<TimetableView />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="geofence" element={<GeofencePage />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboardPage;