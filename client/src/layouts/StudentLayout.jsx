import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import Header from "../components/Header";

const StudentLayout = ({ children, headerTitle, headerSubtitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const routeTitle = useMemo(() => {
    const map = {
      "/student/dashboard": "Dashboard",
      "/student/weekly-timetable": "Weekly Timetable",
      "/student/attendance-history": "Attendance History",
    };
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
      <StudentSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Mobile overlay below header */}
      {isSidebarOpen && (
        <div
          className="fixed left-0 right-0 top-16 bottom-0 bg-black/40 md:hidden z-40"
          onClick={closeSidebar}
        />
      )}

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

export default StudentLayout;
