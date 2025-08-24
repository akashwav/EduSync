import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, deleteStudent } from '../api/studentApi';
import Modal from './Modal';
import { adminResetPassword } from '../api/adminActionsApi'; 

const StudentManagement = () => {
  const [studentList, setStudentList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', rollNumber: '', section: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudentList(response.data);
    } catch (err) {
      setError('Failed to fetch student list.');
    }
  };
  const handleResetPassword = async (userId) => {
    if (window.confirm('Are you sure you want to reset the password for this student?')) {
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

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await createStudent(formData);
      setSuccess(`Student ${response.data.name} added successfully! Temp Password: ${response.data.tempPassword}`);
      setShowAddModal(false);
      setFormData({ name: '', email: '', rollNumber: '', section: '' });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student? Their login account will also be removed.')) {
        try {
            await deleteStudent(id);
            setSuccess('Student deleted successfully.');
            fetchStudents();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete student.');
        }
    }
  };

  return (
    <>
      {showAddModal && (
        <Modal title="Add New Student" onClose={() => setShowAddModal(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
            <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Full Name" required className="shadow-sm border rounded w-full py-2 px-3" />
            <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email (for login)" required className="shadow-sm border rounded w-full py-2 px-3" />
            <input type="text" name="rollNumber" value={formData.rollNumber} onChange={onChange} placeholder="Roll Number" required className="shadow-sm border rounded w-full py-2 px-3" />
            <input type="text" name="section" value={formData.section} onChange={onChange} placeholder="Section (e.g., BCA 1A)" required className="shadow-sm border rounded w-full py-2 px-3" />
            <div className="flex justify-end pt-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded mr-2">Cancel</button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Student</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Students</h2>
          <button onClick={() => { setError(''); setSuccess(''); setShowAddModal(true); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            + Add New Student
          </button>
        </div>

        {success && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">{success}</div>}

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Roll Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentList.length > 0 ? studentList.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.User.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleResetPassword(student.userId)} title="Reset Password" className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1.258a1 1 0 01-.97-1.243l1.263-6.318a1 1 0 01.97-1.243H17z"></path></svg>
                    </button>
                    <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No students added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StudentManagement;