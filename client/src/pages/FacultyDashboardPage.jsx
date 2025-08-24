// File: client/src/pages/FacultyDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import FacultyLayout from '../layouts/FacultyLayout';
import WeeklyTimetableView from '../components/WeeklyTimetableView';
import { getWeeklySchedule, getTodaysSchedule, getAttendanceRecords } from '../api/facultyDashboardApi';
import LiveAttendancePage from './LiveAttendancePage';
import AttendanceRecordModal from '../components/AttendanceRecordModal'; 
import LiveAttendanceQRPage from './LiveAttendanceQRPage';

const FacultyOverview = () => {
    const [todaysSchedule, setTodaysSchedule] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await getTodaysSchedule();
                setTodaysSchedule(response.data);
            } catch (err) {
                console.error("Failed to fetch today's schedule:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    const handleTakeAttendance = (session) => {
        navigate('/faculty/live-attendance-qr', { state: { session } });
    };
    
    if (loading) return <p>Loading...</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Classes</h2>
            {todaysSchedule.length > 0 ? (
                <div className="space-y-4">
                    {todaysSchedule.map(item => (
                        <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">{item.startTime.substring(0, 5)} - {item.endTime.substring(0, 5)}</p>
                                <p>{item.Subject.subjectName} ({item.Subject.subjectCode})</p>
                                <p className="text-sm text-gray-600">Section: {item.section} | Room: {item.Classroom.roomNumber}</p>
                            </div>
                            <button onClick={() => handleTakeAttendance(item)} className="bg-green-500 text-white font-bold py-2 px-4 rounded">Take Attendance</button>
                        </div>
                    ))}
                </div>
            ) : <p className="text-gray-500">No classes scheduled for today.</p>}
        </div>
    );
};
const FacultyWeeklyTimetable = () => {
    const [weeklySchedule, setWeeklySchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await getWeeklySchedule();
                setWeeklySchedule(response.data);
            } catch (error) {
                console.error("Failed to fetch weekly schedule", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    if (loading) return <p>Loading weekly timetable...</p>;
    return <WeeklyTimetableView schedule={weeklySchedule} userType="faculty" />;
};

// --- NEW COMPONENT for Attendance Records ---
const AttendanceRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState(null); // State for the modal

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await getAttendanceRecords();
                setRecords(response.data);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    if (loading) return <p>Loading records...</p>;

    return (
        <>
            {selectedRecord && <AttendanceRecordModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Submitted Attendance Records</h2>
                <div className="space-y-3">
                    {records.length > 0 ? records.map(rec => (
                        <div key={rec.id} className="border p-3 rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-bold">{rec.TimetableEntry.Subject.subjectName} - {rec.TimetableEntry.section}</p>
                                <p className="text-sm text-gray-600">Date: {new Date(rec.date).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedRecord(rec)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-sm">
                                View Details
                            </button>
                        </div>
                    )) : <p>No records found.</p>}
                </div>
            </div>
        </>
    );
};



const FacultyDashboardPage = () => {
  return (
    <FacultyLayout>
      <Routes>
        <Route path="dashboard" element={<FacultyOverview />} />
        <Route path="weekly-timetable" element={<FacultyWeeklyTimetable />} />
        <Route path="attendance-records" element={<AttendanceRecords />} />
        <Route path="live-attendance-qr" element={<LiveAttendanceQRPage />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Routes>
    </FacultyLayout>
  );
};

export default FacultyDashboardPage;