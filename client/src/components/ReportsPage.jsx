// File: client/src/components/ReportsPage.jsx

import React, { useState } from 'react';
import { getDefaulterList } from '../api/reportsApi';
import { sendDefaulterAlerts } from '../api/notificationApi';
import { downloadDefaulterList } from '../api/reportsApi'; // Import the new download function

const ReportsPage = () => {
  const [threshold, setThreshold] = useState(75);
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false); // New state for download button
  const [error, setError] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [searched, setSearched] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError('');
    setNotificationMessage('');
    setSearched(true);
    try {
      const response = await getDefaulterList(threshold);
      setDefaulters(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmails = async () => {
    setSending(true);
    setError('');
    setNotificationMessage('');
    try {
      const response = await sendDefaulterAlerts(threshold);
      setNotificationMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send emails.');
    } finally {
      setSending(false);
    }
  };

  // --- NEW FUNCTION ---
  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    setNotificationMessage('');
    try {
      await downloadDefaulterList(threshold);
    } catch (err) {
      setError('Failed to download report. There may be no defaulters to report.');
    } finally {
      setDownloading(false);
    }
  };
  // --- END OF NEW FUNCTION ---

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attendance Reports & Alerts</h2>
      
      {/* Controls */}
      <div className="flex items-end space-x-4 bg-gray-50 p-4 rounded-lg mb-6">
        {/* ... (Threshold input and Generate Report button) ... */}
        <div>
          <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
            Attendance Threshold:
          </label>
          <div className="flex items-center">
            <input
              type="number" id="threshold" value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="mt-1 shadow-sm border rounded py-2 px-3 w-24"
              min="1" max="100"
            />
            <span className="ml-2 text-lg font-medium">%</span>
          </div>
        </div>
        <button
          onClick={handleGenerateReport} disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:bg-blue-300"
        >
          {loading ? 'Generating...' : 'View Report'}
        </button>
        <button
          onClick={handleSendEmails} disabled={sending}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded disabled:bg-yellow-300"
        >
          {sending ? 'Sending...' : 'Send Warnings'}
        </button>
        {/* --- NEW BUTTON --- */}
        <button
          onClick={handleDownload} disabled={downloading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:bg-green-300"
        >
          {downloading ? 'Preparing...' : 'Download CSV'}
        </button>
        {/* --- END OF NEW BUTTON --- */}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
      {notificationMessage && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">{notificationMessage}</div>}

      {/* Results Table */}
      {searched && !loading && (
        // ... (The rest of the component remains the same)
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Report Results</h3>
          {defaulters.length > 0 ? (
            <div className="space-y-6">
              {defaulters.map(student => (
                <div key={student.studentId} className="border rounded-lg p-4">
                  <h4 className="font-bold text-lg">{student.name}</h4>
                  <p className="text-sm text-gray-600">Roll: {student.rollNumber} | Section: {student.section}</p>
                  <ul className="mt-2 list-disc list-inside">
                    {student.defaulterSubjects.map(subject => (
                      <li key={subject.subjectCode} className="text-sm">
                        <span className="font-semibold">{subject.subjectName} ({subject.subjectCode}):</span>
                        <span className="text-red-600 font-bold ml-2">{subject.percentage}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No students found below the specified threshold.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;