// File: client/src/components/AdminSetupWizard.jsx

import React, { useState } from 'react';
import { generateTimetable } from '../api/timetableApi';
import { completeSetup } from '../api/adminDashboardApi';

// Import all the necessary view components
import CollegeDetails from './CollegeDetails';
import CourseManagement from './CourseManagement';
import FacultyManagement from './FacultyManagement';
import StudentManagement from './StudentManagement';
import ClassroomManagement from './ClassroomManagement';
import TimetableView from './TimetableView';

const AdminSetupWizard = () => {
  // All the state and logic now lives inside this component
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewTimetable, setViewTimetable] = useState(false);
  const [error, setError] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const totalSteps = 5;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const response = await generateTimetable();
      alert(response.data.message);
      setViewTimetable(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinishSetup = async () => {
    if (window.confirm('Are you sure you have completed all setup steps? This will unlock the main dashboard.')) {
      setIsFinishing(true);
      try {
        await completeSetup();
        alert('Setup complete! The main dashboard is now unlocked. The page will now reload.');
        window.location.reload();
      } catch (error) {
        alert('Failed to mark setup as complete.');
      } finally {
        setIsFinishing(false);
      }
    }
  };

  const renderContent = () => {
    if (viewTimetable) {
      return <TimetableView />;
    }
    switch (step) {
      case 1: return <CollegeDetails />;
      case 2: return <CourseManagement />;
      case 3: return <FacultyManagement />;
      case 4: return <StudentManagement />;
      case 5: return <ClassroomManagement />;
      default: return <CollegeDetails />;
    }
  };

  const getNextButtonText = () => {
    switch(step) {
        case 1: return 'Next: Manage Courses';
        case 2: return 'Next: Manage Faculty';
        case 3: return 'Next: Manage Students';
        case 4: return 'Next: Manage Classrooms';
        default: return '';
    }
  }

  return (
    <div>
      {/* Header for the wizard */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          {viewTimetable ? 'Generated Timetable Preview' : `Setup Step ${step} of ${totalSteps}`}
        </h2>
        <p className="text-sm text-gray-500">Follow these steps to configure your institution's data.</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">{error}</div>}
      
      {renderContent()}

      <div className="mt-6 flex justify-between">
        {step > 1 && !viewTimetable ? (
          <button onClick={prevStep} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded">Back</button>
        ) : ( <div></div> )}
        
        {!viewTimetable && (
          step < totalSteps ? (
            <button onClick={nextStep} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">{getNextButtonText()}</button>
          ) : (
            <div className="flex space-x-4">
              <button onClick={handleGenerateClick} disabled={isGenerating} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:bg-blue-300">
                {isGenerating ? 'Generating...' : 'Generate Timetable'}
              </button>
              <button onClick={handleFinishSetup} disabled={isFinishing} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:bg-green-300">
                {isFinishing ? 'Saving...' : 'Finish Setup'}
              </button>
            </div>
          )
        )}
        {viewTimetable && (
             <button onClick={() => setViewTimetable(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded">Back to Setup</button>
        )}
      </div>
    </div>
  );
};

export default AdminSetupWizard;