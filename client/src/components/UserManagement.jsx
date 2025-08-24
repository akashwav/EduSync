// File: client/src/components/UserManagement.jsx

import React, { useState, useEffect } from 'react';
import { getUsers, createUser } from '../api/userApi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ email: '', role: 'Faculty' });
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState(null); // To store newly created user info

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNewUser(null);
    try {
      const response = await createUser(formData);
      setNewUser(response.data); // Save new user info to display password
      setFormData({ email: '', role: 'Faculty' }); // Clear form
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Add User Form */}
      <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New User</h3>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">User Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={onChange} required className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="user@college.com" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3">
              <option value="Faculty">Faculty</option>
              <option value="Student">Student</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Create User</button>
        </form>

        {/* Display new user's temporary password */}
        {newUser && (
          <div className="mt-6 bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-md">
            <h4 className="font-bold">User Created Successfully!</h4>
            <p className="text-sm">Please provide the following credentials to the user:</p>
            <ul className="list-disc list-inside text-sm mt-2">
              <li><strong>Email:</strong> {newUser.email}</li>
              <li><strong>Temporary Password:</strong> <span className="font-mono bg-green-200 px-1 rounded">{newUser.tempPassword}</span></li>
            </ul>
          </div>
        )}
      </div>

      {/* User List */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Faculty & Student List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date Added</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Faculty' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No faculty or students added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;