import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "M3 3h18v18H3z" },
    {
      name: "Courses",
      path: "/admin/courses",
      icon: "M4 6h16M4 12h16M4 18h16",
    },
    {
      name: "Teachers",
      path: "/admin/faculty",
      icon: "M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM4 20c0-2.21 3.582-4 8-4s8 1.79 8 4",
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    },
    { name: "Classrooms", path: "/admin/classrooms", icon: "M4 6h16v12H4z" },
    {
      name: "Allocated Classrooms",
      path: "/admin/classroom-assignments",
      icon: "M3 12l9-9 9 9M4 10v10h16V10",
    },
    {
      name: "Generate Timetable",
      path: "/admin/generate-timetable",
      icon: "M4 6h16M4 12h16M4 18h16",
    },
    {
      name: "View Timetable",
      path: "/admin/view-timetable",
      icon: "M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: "M4 6h16M4 12h16M4 18h16",
    },
    { name: 'Geofence Settings', path: '/admin/geofence', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white border-r flex flex-col transform
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      transition-transform duration-200 ease-in-out
      md:translate-x-0 md:static md:inset-0 z-50`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <img
          src="/logo.jpg"
          alt="EduSync Logo"
          className="w-8 h-8 mr-2 rounded-full"
        />

        <p className="font-black text-blue-600 text-2xl">EduSync</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={onClose} // close on mobile after nav
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={link.icon}
              />
            </svg>
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4 flex items-center">
        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
          {user?.name?.charAt(0).toUpperCase() ||
            user?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold">{user?.name || user?.email}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="ml-auto text-gray-400 hover:text-red-500"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
