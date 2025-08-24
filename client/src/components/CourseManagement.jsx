import React, { useState, useEffect } from 'react';
import { getCourses, createCourse, deleteCourse } from '../api/courseApi';
import SubjectManager from './SubjectManager';
import Modal from './Modal';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', abbreviation: '', totalSemesters: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [managingCourse, setManagingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses.');
    }
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createCourse(formData);
      setSuccess(`Course '${formData.abbreviation}' added successfully.`);
      setShowAddModal(false);
      setFormData({ name: '', abbreviation: '', totalSemesters: '' });
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated subjects.')) {
        try {
            await deleteCourse(id);
            setSuccess('Course deleted successfully.');
            fetchCourses();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete course.');
        }
    }
  };

  return (
    <>
      {managingCourse && <SubjectManager course={managingCourse} onClose={() => setManagingCourse(null)} />}

      {showAddModal && (
        <Modal title="Add New Course" onClose={() => setShowAddModal(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-bold mb-1">Course Name</label>
              <input type="text" name="name" value={formData.name} onChange={onChange} required className="shadow-sm border rounded w-full py-2 px-3" placeholder="e.g., Bachelor of Computer Application" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Abbreviation</label>
              <input type="text" name="abbreviation" value={formData.abbreviation} onChange={onChange} required className="shadow-sm border rounded w-full py-2 px-3" placeholder="e.g., BCA" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Total Semesters</label>
              <input type="number" name="totalSemesters" value={formData.totalSemesters} onChange={onChange} required className="shadow-sm border rounded w-full py-2 px-3" placeholder="e.g., 8" />
            </div>
            <div className="flex justify-end pt-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded mr-2">Cancel</button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Course</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-700">Courses & Subjects</h2>
          <button onClick={() => { setError(''); setSuccess(''); setShowAddModal(true); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span>Add New Course</span>
          </button>
        </div>

        {success && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm flex-shrink-0">{success}</div>}
        
        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abbreviation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semesters</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.length > 0 ? courses.map(course => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{course.abbreviation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.totalSemesters}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button onClick={() => setManagingCourse(course)} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-200">Manage Subjects</button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No courses added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CourseManagement;