// File: client/src/components/GenerateTimetablePage.jsx
// This is a new file.

import React, { useState } from 'react';
import { generateTimetable } from '../api/timetableApi';
import { useNavigate } from 'react-router-dom';

const GenerateTimetablePage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await generateTimetable();
      setSuccessMessage(response.data.message);
      // Optional: Automatically navigate to the timetable view after a short delay
      setTimeout(() => {
        navigate('/admin/view-timetable');
      }, 2000); // 2-second delay
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800">Generate Master Timetable</h2>
      <p className="text-gray-600 mt-2 mb-6">
        Click the button below to start the automatic generation process. This will use all the data you have entered (courses, subjects, faculty, classrooms) to create a new, conflict-free schedule for the upcoming semester.
      </p>
      <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md mb-6">
        <strong>Note:</strong> Running this process will delete any previously generated timetable and create a new one from scratch.
      </p>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
      {successMessage && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">{successMessage}</div>}

      <div className="flex justify-center">
        <button
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg disabled:bg-green-300"
        >
          {isGenerating ? 'Generating, please wait...' : 'Start Timetable Generation'}
        </button>
      </div>
    </div>
  );
};

export default GenerateTimetablePage;