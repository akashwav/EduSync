// File: client/src/components/SubjectManager.jsx

import React, { useState, useEffect } from 'react';
import { getSubjectsByCourse, addSubject } from '../api/subjectApi';

const SubjectManager = ({ course, onClose }) => {
  const [subjectsBySem, setSubjectsBySem] = useState({});
  const [currentSemester, setCurrentSemester] = useState(1);
  // Add 'priority' to the initial form state
  const [formData, setFormData] = useState({ 
    subjectType: 'Theory', 
    subjectCode: '', 
    subjectName: '', 
    creditPoint: '', 
    classesPerWeek: '', 
    priority: 'Major' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // ... (useEffect and other functions remain the same)
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjectsByCourse(course.id);
        const groupedSubjects = response.data.reduce((acc, subject) => {
          (acc[subject.semester] = acc[subject.semester] || []).push(subject);
          return acc;
        }, {});
        setSubjectsBySem(groupedSubjects);
      } catch (err) {
        setError('Failed to fetch subjects.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [course.id]);
  
  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const subjectData = { ...formData, semester: currentSemester };
      await addSubject(course.id, subjectData);
      
      setSubjectsBySem(prev => ({
          ...prev,
          [currentSemester]: [...(prev[currentSemester] || []), subjectData]
      }));
      // Reset form
      setFormData({ subjectType: 'Theory', subjectCode: '', subjectName: '', creditPoint: '', classesPerWeek: '', priority: 'Major' });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subject.');
    }
  };

  const renderSemesterTabs = () => {
    let tabs = [];
    for (let i = 1; i <= course.totalSemesters; i++) {
      tabs.push(
        <button key={i} onClick={() => setCurrentSemester(i)} className={`px-4 py-2 text-sm font-medium rounded-md ${currentSemester === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Semester {i}
        </button>
      );
    }
    return tabs;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* ... (header remains the same) ... */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Subjects for {course.abbreviation}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        <div className="flex space-x-2 mb-4 border-b pb-2 overflow-x-auto">{renderSemesterTabs()}</div>
        
        <div className="flex-grow overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Add Subject to Semester {currentSemester}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                       {/* --- ADD THESE MISSING FIELDS --- */}
                        <div>
                            <label className="block text-sm font-bold mb-1">Subject Type</label>
                            <select name="subjectType" value={formData.subjectType} onChange={handleFormChange} className="shadow-sm border rounded w-full py-2 px-3">
                                <option>Theory</option>
                                <option>Practical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Subject Code</label>
                            <input type="text" name="subjectCode" value={formData.subjectCode} onChange={handleFormChange} required className="shadow-sm border rounded w-full py-2 px-3" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Subject Name</label>
                            <input type="text" name="subjectName" value={formData.subjectName} onChange={handleFormChange} required className="shadow-sm border rounded w-full py-2 px-3" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Credit Point</label>
                            <input type="number" name="creditPoint" value={formData.creditPoint} onChange={handleFormChange} required className="shadow-sm border rounded w-full py-2 px-3" />
                        </div>
                        {/* ... (other form fields) ... */}
                        <div>
                            <label className="block text-sm font-bold mb-1">Classes Per Week</label>
                            <input type="number" name="classesPerWeek" value={formData.classesPerWeek} onChange={handleFormChange} required className="shadow-sm border rounded w-full py-2 px-3" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleFormChange} className="shadow-sm border rounded w-full py-2 px-3">
                                <option>Major</option>
                                <option>Minor</option>
                                <option>Interdisciplinary</option>
                                <option>Value Added</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Add Subject</button>
                    </form>
                </div>
                {/* ... (list of subjects remains the same) ... */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">Existing Subjects in Sem {currentSemester}</h4>
                    <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md h-64 overflow-y-auto">
                        {loading ? <p>Loading...</p> : (subjectsBySem[currentSemester] && subjectsBySem[currentSemester].length > 0) ? subjectsBySem[currentSemester].map(s => (
                            <li key={s.subjectCode} className="text-sm">[{s.priority || 'Major'}] {s.subjectCode} - {s.subjectName}</li>
                        )) : (
                            <li className="text-sm text-gray-500">No subjects added for this semester.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectManager;