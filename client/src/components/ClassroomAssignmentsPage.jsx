// File: client/src/components/ClassroomAssignmentsPage.jsx

import React, { useState, useEffect } from 'react';
import { getClassroomAssignments } from '../api/classroomAssignmentApi';

const ClassroomAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getClassroomAssignments();
        setAssignments(response.data);
      } catch (err) {
        setError('Failed to load classroom assignments.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Home Classroom Assignments</h2>
        <p className="text-sm text-gray-500 mt-1">This list shows the default theory classroom assigned to each section.</p>
      </div>
      
      {loading && <p>Loading assignments...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && (
        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Classroom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.roomNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassroomAssignmentsPage;