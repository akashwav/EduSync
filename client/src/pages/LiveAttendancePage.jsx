// File: client/src/pages/LiveAttendancePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSessionDetails } from '../api/facultyDashboardApi';
import { getStudentsForSession, submitAttendance, detectAnomalies } from '../api/attendanceApi';
import { getAttendanceForSession } from '../api/attendanceApi'; 


const LiveAttendancePage = () => {
  const [session, setSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendance, setAttendance] = useState({});
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectionRun, setDetectionRun] = useState(false);

  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (!sessionId) {
        throw new Error("No session ID was provided in the URL.");
      }
      
      const [sessionRes, studentsRes] = await Promise.all([
          getSessionDetails(sessionId),
          getStudentsForSession(sessionId)
      ]);
      
      setSession(sessionRes.data);
      setStudents(studentsRes.data);
      setFilteredStudents(studentsRes.data);

      const initialAttendance = studentsRes.data.reduce((acc, student) => {
        acc[student.id] = 'Present';
        return acc;
      }, {});
      setAttendance(initialAttendance);
      const attendanceRes = await getAttendanceForSession(sessionId, new Date().toISOString().slice(0, 10));
        if (attendanceRes.data.length > 0) {
            setIsSubmitted(true);
            // Populate the attendance state with the fetched data
            const existingData = attendanceRes.data.reduce((acc, item) => {
                acc[item.studentId] = item.status;
                return acc;
            }, {});
            setAttendance(existingData);
        }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Failed to load attendance sheet data. Please return to the dashboard and try again.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [sessionId]);

  useEffect(() => {
    const results = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleDetectAnomalies = async () => {
    
    if (!session || !session.section) {
        console.error("CRITICAL ERROR: handleDetectAnomalies was called but session.section is not available.", session);
        setError("Session data is not ready. Please wait a moment and try again.");
        return;
    }
    console.log("2. Setting detecting state to TRUE.");
    setDetecting(true);
    setDetectionRun(true);
    setAnomalies([]);
    setError('');
    try {
        console.log("3. Calling API with section:", session.section);
        const response = await detectAnomalies(session.section);
        console.log("4. API call successful. Response:", response.data);
        setAnomalies(response.data);
    } catch (err) {
        console.error("5. API call FAILED. Error object:", err);
        setError(err.response?.data?.message || 'Could not detect anomalies.');
    } finally {
        console.log("6. FINALLY block reached. Setting detecting state to FALSE.");
        setDetecting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const attendanceData = Object.keys(attendance).map(studentId => ({
        studentId,
        status: attendance[studentId],
      }));
      await submitAttendance({
        timetableEntryId: session.id,
        attendanceData,
      });
      alert('Attendance submitted successfully! This sheet is now locked.');
      navigate('/faculty/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading attendance sheet...</div>;
  }

  if (error) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">An Error Occurred</h2>
          <p className="text-gray-600">{error}</p>
          <Link to="/faculty/dashboard" className="mt-6 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Return to Dashboard
          </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800">Live Attendance</h2>
      <p className="text-gray-600 mb-6">{session?.Subject?.subjectCode}: {session?.Subject?.subjectName}</p>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Student Roster</h3>
        <p className="text-sm text-gray-600 mb-4">Mark attendance for the students of {session?.section}</p>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <input
            type="text"
            placeholder="Search by name or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-sm border rounded w-full py-2 px-3"
          />
          <div className="flex w-full md:w-auto space-x-2">
            {/* --- THIS IS THE FIX --- */}
            <button 
              onClick={handleDetectAnomalies} 
              disabled={!session || detecting || loading} 
              className="bg-yellow-500 text-white font-bold py-2 px-4 rounded whitespace-nowrap disabled:bg-yellow-300 disabled:cursor-not-allowed flex-1"
            >
              {detecting ? 'Detecting...' : 'Detect Anomalies'}
            </button>
            {/* --- END OF FIX --- */}
            <button onClick={fetchData} title="Refresh Data" className="bg-gray-200 p-2 rounded hover:bg-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.186l-1.414 1.414a5.002 5.002 0 00-8.073-1.634l-1.414 1.414A7.002 7.002 0 014 9.101V7a1 1 0 01-2 0V3a1 1 0 011-1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.899-2.186l1.414-1.414a5.002 5.002 0 008.073 1.634l1.414-1.414A7.002 7.002 0 0116 10.899V13a1 1 0 012 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {detectionRun && !detecting && anomalies.length > 0 && anomalies.map((anomaly, index) => (
              <div key={index} className={`border-l-4 p-3 rounded-md text-sm ${anomaly.type === 'No Anomalies' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-yellow-100 border-yellow-500 text-yellow-800'}`}>
                  <p><span className="font-bold">{anomaly.type}: {anomaly.studentName}</span> - {anomaly.message}</p>
              </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredStudents.map(student => (
          <div key={student.id} className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-500">{student.rollNumber}</p>
            </div>
            <div className="flex items-center space-x-2">
              {isSubmitted ? (
                <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    attendance[student.id] === 'Present' ? 'bg-green-100 text-green-800' :
                    attendance[student.id] === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {attendance[student.id]}
                </span>
              ) : (
                <>
                  <button onClick={() => handleStatusChange(student.id, 'Present')} className={`px-3 py-1 text-xs rounded-full ${attendance[student.id] === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Present</button>
                  <button onClick={() => handleStatusChange(student.id, 'Absent')} className={`px-3 py-1 text-xs rounded-full ${attendance[student.id] === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Absent</button>
                  <button onClick={() => handleStatusChange(student.id, 'Late')} className={`px-3 py-1 text-xs rounded-full ${attendance[student.id] === 'Late' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>Late</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleSubmit} disabled={submitting || loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded disabled:bg-blue-300">
          {submitting ? 'Submitting...' : 'Submit Final Attendance'}
        </button>
      </div>
    </div>
  );
};

export default LiveAttendancePage;