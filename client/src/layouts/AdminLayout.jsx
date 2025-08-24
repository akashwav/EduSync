import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = ({ children, headerTitle, headerSubtitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Map route to a nice title
  const routeTitle = useMemo(() => {
    const map = {
      "/admin/dashboard": "Dashboard",
      "/admin/courses": "Courses",
      "/admin/faculty": "Teachers",
      "/admin/students": "Students",
      "/admin/classrooms": "Classrooms",
      "/admin/classroom-assignments": "Assignments",
      "/admin/generate-timetable": "Generate Timetable",
      "/admin/view-timetable": "View Timetable",
      "/admin/reports": "Reports",
    };
    // Choose longest matching prefix
    const path = location.pathname;
    let best = "Dashboard";
    for (const key of Object.keys(map).sort((a, b) => b.length - a.length)) {
      if (path.startsWith(key)) {
        best = map[key];
        break;
      }
    }
    return best;
  }, [location.pathname]);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Overlay (mobile only) - starts below header so hamburger stays visible */}
      {isSidebarOpen && (
        <div
          className="fixed left-0 right-0 top-16 bottom-0 bg-black/40 md:hidden z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={headerTitle ?? routeTitle}
          subtitle={headerSubtitle}
          onToggleSidebar={() => setIsSidebarOpen((s) => !s)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
