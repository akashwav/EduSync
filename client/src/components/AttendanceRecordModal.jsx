// File: client/src/components/AttendanceRecordModal.jsx

import React, { useState, useEffect } from 'react';
import { getStudentsForSession, getAttendanceForSession } from '../api/attendanceApi';
import Modal from './Modal';

const AttendanceRecordModal = ({ record, onClose }) => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          getStudentsForSession(record.timetableEntryId),
          getAttendanceForSession(record.timetableEntryId, record.date)
        ]);
        
        setStudents(studentsRes.data);
        const attendanceMap = attendanceRes.data.reduce((acc, item) => {
            acc[item.studentId] = item.status;
            return acc;
        }, {});
        setAttendance(attendanceMap);

      } catch (err) {
        setError('Failed to load attendance details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [record]);

  const getStatusPill = (status) => {
    switch (status) {
        case 'Present': return <span className="px-3 py-1 text-xs rounded-full font-semibold bg-green-100 text-green-800">Present</span>;
        case 'Absent': return <span className="px-3 py-1 text-xs rounded-full font-semibold bg-red-100 text-red-800">Absent</span>;
        case 'Late': return <span className="px-3 py-1 text-xs rounded-full font-semibold bg-yellow-100 text-yellow-800">Late</span>;
        default: return <span className="px-3 py-1 text-xs rounded-full font-semibold bg-gray-100 text-gray-800">N/A</span>;
    }
  };

  return (
    <Modal title="Attendance Record" onClose={onClose}>
        <div className="mb-4">
            <p><span className="font-semibold">Subject:</span> {record.TimetableEntry.Subject.subjectName}</p>
            <p><span className="font-semibold">Section:</span> {record.TimetableEntry.section}</p>
            <p><span className="font-semibold">Date:</span> {new Date(record.date).toLocaleDateString()}</p>
        </div>
        {loading && <p>Loading details...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && (
             <div className="overflow-y-auto max-h-96 border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Student Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Roll Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map(student => (
                            <tr key={student.id}>
                                <td className="px-6 py-4">{student.name}</td>
                                <td className="px-6 py-4">{student.rollNumber}</td>
                                <td className="px-6 py-4">{getStatusPill(attendance[student.id])}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </Modal>
  );
};

export default AttendanceRecordModal;