// File: client/src/components/AttendanceSheetModal.jsx

import React, { useState, useEffect } from 'react';
import { getStudentsForSession, submitAttendance } from '../api/attendanceApi';

const AttendanceSheetModal = ({ session, onClose }) => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudentsForSession(session.id);
        setStudents(response.data);
        // Initialize all students as 'Present' by default
        const initialAttendance = response.data.reduce((acc, student) => {
          acc[student.id] = 'Present';
          return acc;
        }, {});
        setAttendance(initialAttendance);
      } catch (err) {
        setError('Failed to load student list.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [session.id]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
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
      
      alert('Attendance submitted successfully!');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Attendance Sheet</h2>
            <p className="text-sm text-gray-600">{session.Subject.subjectName} - {session.section}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <div className="flex-grow overflow-y-auto">
          {loading ? <p>Loading students...</p> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Roll Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.rollNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleStatusChange(student.id, 'Present')} className={`px-3 py-1 text-xs rounded-full ${attendance[student.id] === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Present</button>
                        <button onClick={() => handleStatusChange(student.id, 'Absent')} className={`px-3 py-1 text-xs rounded-full ${attendance[student.id] === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Absent</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleSubmit} disabled={submitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:bg-blue-300">
            {submitting ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheetModal;