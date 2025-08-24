// File: client/src/components/CollegeDetails.jsx

import React, { useState, useEffect } from 'react';
import { getCollege } from '../api/collegeApi';

const CollegeDetails = () => {
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const response = await getCollege();
        setCollege(response.data);
      } catch (err) {
        setError('Could not fetch college details. Please contact support.');
      } finally {
        setLoading(false);
      }
    };
    fetchCollegeDetails();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading College Information...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Confirm College Information</h2>
      <p className="text-gray-600 mb-6">These are your institution's details, set by the system administrator. Please confirm they are correct before proceeding.</p>
      
      {college ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">College Name</h3>
            <p className="text-lg text-gray-900">{college.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="text-lg text-gray-900">{college.address}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Affiliated University</h3>
            <p className="text-lg text-gray-900">{college.affiliatedUniversity}</p>
          </div>
        </div>
      ) : (
        <p>No college information found.</p>
      )}
    </div>
  );
};

export default CollegeDetails;