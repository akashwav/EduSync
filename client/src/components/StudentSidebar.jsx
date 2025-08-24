import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StudentSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H9a2 2 0 01-2-2V5z' },
    { name: 'Weekly Timetable', path: '/student/weekly-timetable', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Scan for Attendance', path: '/student/check-in', icon: 'M3.75 4.875c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013.75 9.375v-4.5zM3.75 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013.75 19.125v-4.5zM13.5 4.875c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0113.5 9.375v-4.5zM13.5 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0113.5 19.125v-4.5z' },
    { name: 'Attendance History', path: '/student/attendance-history', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 transform w-64 bg-white shadow-lg flex flex-col flex-shrink-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 z-50`}
    >
      <div className="h-16 flex items-center justify-center border-b">
        <img
          src="/logo.jpg"
          alt="EduSync Logo"
          className="w-8 h-8 mr-2 rounded-full"
        />

        <p className="font-black text-blue-600 text-2xl">EduSync</p>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navLinks.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
            </svg>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            {user?.name?.substring(0, 1).toUpperCase() || user?.email?.substring(0, 1).toUpperCase()}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="ml-auto text-gray-500 hover:text-red-500 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
