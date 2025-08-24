
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import WeeklyTimetableView from '../components/WeeklyTimetableView';
import { getTodaysSchedule, getAttendanceSummary, getWeeklySchedule } from '../api/studentDashboardApi';
import AttendanceHistoryPage from './AttendanceHistoryPage'; 
import CheckInScreen from './CheckInScreen';

// This is the new main dashboard component for students
const StudentOverview = () => {
    const [todaysSchedule, setTodaysSchedule] = React.useState([]);
    const [summary, setSummary] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [scheduleRes, summaryRes] = await Promise.all([getTodaysSchedule(), getAttendanceSummary()]);
                setTodaysSchedule(scheduleRes.data);
                setSummary(summaryRes.data);
            } catch (err) {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getPercentageColor = (percentage) => {
        if (percentage < 75) return 'text-red-600';
        if (percentage < 90) return 'text-yellow-600';
        return 'text-green-600';
    };

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Classes</h2>
                {todaysSchedule.length > 0 ? (
                    <div className="space-y-4">
                        {todaysSchedule.map(item => (
                            <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
                                <p className="font-bold">{item.startTime?.substring(0, 5)} - {item.endTime?.substring(0, 5)}</p>
                                <p>{item.Subject?.subjectName}</p>
                                <p className="text-sm text-gray-600">Prof. {item.Faculty?.initials} | Room: {item.Classroom?.roomNumber}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-gray-500">No classes scheduled for today.</p>}
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Overall Attendance</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Attended / Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Percentage</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {summary.map(item => (
                            <tr key={item.subjectId}>
                                <td className="px-6 py-4">{item.subjectName}</td>
                                <td className="px-6 py-4">{item.presentClasses} / {item.totalClasses}</td>
                                <td className={`px-6 py-4 font-bold text-lg ${getPercentageColor(item.percentage)}`}>{item.percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// This component fetches and displays the weekly timetable for students
const StudentWeeklyTimetable = () => {
    const [weeklySchedule, setWeeklySchedule] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSchedule = async () => {
            const response = await getWeeklySchedule();
            setWeeklySchedule(response.data);
            setLoading(false);
        };
        fetchSchedule();
    }, []);

    if (loading) return <p>Loading weekly timetable...</p>;
    return <WeeklyTimetableView schedule={weeklySchedule} userType="student" />;
};


const StudentDashboardPage = () => {
  return (
    <StudentLayout>
      <Routes>
        <Route path="dashboard" element={<StudentOverview />} />
        <Route path="weekly-timetable" element={<StudentWeeklyTimetable />} />
        <Route path="check-in" element={<CheckInScreen />} />
        <Route path="attendance-history" element={<AttendanceHistoryPage />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Routes>
    </StudentLayout>
  );
};

export default StudentDashboardPage;