import React, { useState, useEffect } from 'react';
import { getAttendanceHistory, getAttendanceSummary } from '../api/studentDashboardApi';
import AttendanceHistoryChart from '../components/AttendanceHistoryChart';

const AttendanceHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, summaryRes] = await Promise.all([
          getAttendanceHistory(),
          getAttendanceSummary()
        ]);
        setHistory(historyRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        setError('Failed to load attendance history.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusPill = (status) => {
    switch (status) {
        case 'Present': return <span className="px-2 py-1 text-xs rounded-full font-semibold bg-green-100 text-green-800">Present</span>;
        case 'Absent': return <span className="px-2 py-1 text-xs rounded-full font-semibold bg-red-100 text-red-800">Absent</span>;
        case 'Late': return <span className="px-2 py-1 text-xs rounded-full font-semibold bg-yellow-100 text-yellow-800">Late</span>;
        default: return <span className="px-2 py-1 text-xs rounded-full font-semibold bg-gray-100 text-gray-800">N/A</span>;
    }
  };

  if (loading) return <p>Loading history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Attendance Graph</h2>
        <AttendanceHistoryChart summary={summary} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-[calc(100vh-24rem)]">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex-shrink-0">Detailed History</h2>
        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.TimetableEntry?.Subject?.subjectName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusPill(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryPage;