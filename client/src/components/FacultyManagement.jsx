// File: client/src/components/FacultyManagement.jsx

import React, { useState, useEffect } from 'react';
import { getFaculty, createFaculty, deleteFaculty } from '../api/facultyApi';
import { adminResetPassword } from '../api/adminActionsApi';
import Modal from './Modal';

const FacultyManagement = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', employeeId: '', department: '', initials: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await getFaculty();
      setFacultyList(response.data);
    } catch (err) {
      setError('Failed to fetch faculty list.');
    }
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await createFaculty(formData);
      setSuccess(`Faculty ${response.data.name} added. Temp Password: ${response.data.tempPassword}`);
      setShowModal(false);
      setFormData({ name: '', email: '', employeeId: '', department: '', initials: '' });
      fetchFaculty();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add faculty.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member? Their login account will also be removed.')) {
        try {
            await deleteFaculty(id);
            setSuccess('Faculty member deleted successfully.');
            fetchFaculty();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete faculty member.');
        }
    }
  };

  const handleResetPassword = async (userId) => {
    if (window.confirm('Are you sure you want to reset the password for this user?')) {
        setError('');
        setSuccess('');
        try {
            const response = await adminResetPassword(userId);
            setSuccess(`${response.data.message} New password: ${response.data.tempPassword}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        }
    }
  };

  return (
    <>
      {showModal && (
        <Modal title="Add New Faculty" onClose={() => setShowModal(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Full Name" required className="shadow-sm border rounded w-full py-2 px-3" />
              <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email (for login)" required className="shadow-sm border rounded w-full py-2 px-3" />
              <input type="text" name="employeeId" value={formData.employeeId} onChange={onChange} placeholder="Employee ID" required className="shadow-sm border rounded w-full py-2 px-3" />
              <input type="text" name="initials" value={formData.initials} onChange={onChange} placeholder="Initials (e.g., AC)" required className="shadow-sm border rounded w-full py-2 px-3" />
              <input type="text" name="department" value={formData.department} onChange={onChange} placeholder="Department (e.g., BCA)" required className="shadow-sm border rounded w-full py-2 px-3" />
            </div>
            <div className="flex justify-end pt-4">
              <button type="button" onClick={() => setShowModal(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded mr-2">Cancel</button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Faculty</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-700">Faculty Members</h2>
          <button onClick={() => { setError(''); setSuccess(''); setShowModal(true); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span>Add New Faculty</span>
          </button>
        </div>
        
        {success && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm flex-shrink-0">{success}</div>}

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (Initials)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {facultyList.length > 0 ? facultyList.map(faculty => (
                <tr key={faculty.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{faculty.name} ({faculty.initials})</td>
                  <td className="px-6 py-4 whitespace-nowrap">{faculty.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.User.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button onClick={() => handleResetPassword(faculty.userId)} title="Reset Password" className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1.258a1 1 0 01-.97-1.243l1.263-6.318a1 1 0 01.97-1.243H17z"></path></svg>
                    </button>
                    <button onClick={() => handleDelete(faculty.id)} title="Delete Faculty" className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No faculty added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FacultyManagement;
