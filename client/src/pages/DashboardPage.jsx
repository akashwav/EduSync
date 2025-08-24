// File: client/src/pages/DashboardPage.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import CollegeDetails from '../components/CollegeDetails';
import CourseManagement from '../components/CourseManagement';
import UserManagement from '../components/UserManagement'; // Import the new component

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const renderAdminDashboard = () => (
    <>
      <CollegeDetails /> 
      <CourseManagement />
      <UserManagement /> {/* Add the new component here */}
    </>
  );
  
  // ... (the rest of the file remains the same)
  const renderFacultyDashboard = () => (
    <p>Welcome, Faculty Member! Your dashboard is under construction.</p>
  );

  const renderStudentDashboard = () => (
    <p>Welcome, Student! Your dashboard is under construction.</p>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{user?.role} Dashboard</h1>
            <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
          </div>
          
          {user && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8" role="alert">
              <p className="font-bold">Logged in as: {user.email}</p>
            </div>
          )}

          {user?.role === 'Admin' && renderAdminDashboard()}
          {user?.role === 'Faculty' && renderFacultyDashboard()}
          {user?.role === 'Student' && renderStudentDashboard()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;