import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const FacultySidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/faculty/dashboard", icon: "M3 3h18v18H3z" },
    { name: "Weekly Timetable", path: "/faculty/weekly-timetable", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14" },
    { name: "Attendance Records", path: "/faculty/attendance-records", icon: "M9 17v-2m3 2v-4m3 4v-6" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white border-r flex flex-col transform
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      transition-transform duration-200 ease-in-out
      md:translate-x-0 md:static md:inset-0 z-50`}
    >
      <div className="h-16 flex items-center justify-center border-b">
        <img
          src="/logo.jpg"
          alt="EduSync Logo"
          className="w-8 h-8 mr-2 rounded-full"
        />

        <p className="font-black text-blue-600 text-2xl">EduSync</p>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
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

      <div className="border-t p-4 flex items-center">
        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold">{user?.name || user?.email}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
        <button onClick={handleLogout} className="ml-auto text-gray-400 hover:text-red-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default FacultySidebar;
