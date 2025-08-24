// File: client/src/pages/SuperadminDashboardPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { onboardCollege } from '../api/superadminApi';

const SuperadminDashboardPage = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeAddress: '',
    affiliatedUniversity: '',
    adminEmail: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setSubmitting(true);
    try {
      const response = await onboardCollege(formData);
      setSuccess(response.data);
      setFormData({ collegeName: '', collegeAddress: '', affiliatedUniversity: '', adminEmail: '' }); // Clear form
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to onboard college.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Superadmin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user?.email}</p>
          </div>
          <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>

        {/* Onboarding Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Onboard New College</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
          <form onSubmit={onSubmit} className="space-y-4">
            <input type="text" name="collegeName" value={formData.collegeName} onChange={onChange} placeholder="College Name" required className="shadow-sm border rounded w-full py-2 px-3" />
            <input type="text" name="collegeAddress" value={formData.collegeAddress} onChange={onChange} placeholder="College Address" required className="shadow-sm border rounded w-full py-2 px-3" />
            <input type="text" name="affiliatedUniversity" value={formData.affiliatedUniversity} onChange={onChange} placeholder="Affiliated University" required className="shadow-sm border rounded w-full py-2 px-3" />
            <input type="email" name="adminEmail" value={formData.adminEmail} onChange={onChange} placeholder="New College Admin Email" required className="shadow-sm border rounded w-full py-2 px-3" />
            <button type="submit" disabled={submitting} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded w-full disabled:bg-green-300">
              {submitting ? 'Onboarding...' : 'Onboard College'}
            </button>
          </form>

          {success && (
            <div className="mt-6 bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-md">
              <h4 className="font-bold">College Onboarded Successfully!</h4>
              <p className="text-sm">Please provide the following credentials to the new admin:</p>
              <ul className="list-disc list-inside text-sm mt-2">
                <li><strong>Email:</strong> {success.admin.email}</li>
                <li><strong>Temporary Password:</strong> <span className="font-mono bg-green-200 px-1 rounded">{success.admin.tempPassword}</span></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperadminDashboardPage;