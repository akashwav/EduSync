// File: client/src/components/ClassroomManagement.jsx

import React, { useState, useEffect } from 'react';
import { getClassrooms, createClassroom, deleteClassroom } from '../api/classroomApi';
import Modal from './Modal';

const ClassroomManagement = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ roomNumber: '', type: 'Classroom', capacity: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClassrooms();
  }, []);

  // Fetch classrooms
  const fetchClassrooms = async () => {
    try {
      const res = await getClassrooms();
      setClassrooms(res.data || []); // assuming backend returns { data: [...] }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch classrooms.');
    }
  };

  // Form input change
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit new classroom
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.roomNumber.trim() || !formData.capacity) {
      setError('Room number and capacity are required.');
      return;
    }

    try {
      await createClassroom({
        roomNumber: formData.roomNumber.trim(),
        type: formData.type,
        capacity: parseInt(formData.capacity, 10),
      });
      setSuccess('Classroom added successfully.');
      setShowAddModal(false);
      setFormData({ roomNumber: '', type: 'Classroom', capacity: '' });
      fetchClassrooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add classroom.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await deleteClassroom(id);
        setSuccess('Classroom deleted successfully.');
        fetchClassrooms();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete classroom.');
      }
    }
  };

  return (
    <>
      {showAddModal && (
        <Modal title="Add New Classroom" onClose={() => setShowAddModal(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
            <input type="text" name="roomNumber" value={formData.roomNumber} onChange={onChange} placeholder="Room Number (e.g., 101, Lab A)" required className="shadow-sm border rounded w-full py-2 px-3" />
            <input type="number" name="capacity" value={formData.capacity} onChange={onChange} placeholder="Capacity" required className="shadow-sm border rounded w-full py-2 px-3" />
            <select name="type" value={formData.type} onChange={onChange} className="shadow-sm border rounded w-full py-2 px-3">
              <option value="Classroom">Classroom</option>
              <option value="Lab">Lab</option>
            </select>
            <div className="flex justify-end pt-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded mr-2">Cancel</button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Classroom</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-700">Manage Classrooms</h2>
          <button onClick={() => { setError(''); setSuccess(''); setShowAddModal(true); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span>Add New Classroom</span>
          </button>
        </div>

        {success && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm flex-shrink-0">{success}</div>}

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classrooms.length > 0 ? classrooms.map(c => (
                <tr key={c.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{c.roomNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No classrooms added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ClassroomManagement;