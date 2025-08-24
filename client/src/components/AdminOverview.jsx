import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/adminDashboardApi';
import { getDefaulterList } from '../api/reportsApi';
import AttendanceChart from './AttendanceChart';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path></svg>
    </div>
  </div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState(null); // Start with null
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, defaultersRes] = await Promise.all([
          getDashboardStats(),
          getDefaulterList(75)
        ]);
        setStats(statsRes.data);
        setDefaulters(defaultersRes.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- THIS IS THE FIX ---
  // We now have clear states for Loading, Error, and Success.
  if (loading) {
    return <p className="text-center p-4">Loading dashboard overview...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center p-4">{error}</p>;
  }
  // --- END OF FIX ---

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Courses" value={stats?.courseCount || 0} icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        <StatCard title="Teachers" value={stats?.facultyCount || 0} icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        <StatCard title="Classrooms" value={stats?.classroomCount || 0} icon="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <StatCard title="Students" value={stats?.studentCount || 0} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 013.39-2.432M12 6a3 3 0 11-6 0 3 3 0 016 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
      </div>

      {/* Advanced Analytics Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Advanced Analytics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="font-semibold text-gray-800">Department Attendance</h4>
            <p className="text-sm text-gray-500 mb-4">Overall attendance percentage by department for the current month.</p>
            <AttendanceChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="font-semibold text-gray-800">Low Attendance Report</h4>
            <p className="text-sm text-gray-500 mb-4">Students with attendance below 75%.</p>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {defaulters.length > 0 ? defaulters.map(student => (
                <div key={student.studentId}>
                  <p className="font-semibold">{student.name} <span className="text-gray-500 font-normal">({student.rollNumber})</span></p>
                  <div className="pl-4 mt-1 space-y-1">
                    {student.defaulterSubjects.map(subject => (
                      <div key={subject.subjectCode} className="flex justify-between items-center text-sm">
                        <p className="text-gray-600">{subject.subjectName}</p>
                        <span className="font-bold text-white text-xs bg-red-500 px-2 py-0.5 rounded-full">
                          {subject.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )) : <p className="text-gray-500">No students are below the 75% threshold.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;