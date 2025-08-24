// File: client/src/components/ProtectedRoute.jsx

import React from 'react';
// --- THIS IS THE FIX ---
// Import the useLocation hook from react-router-dom
import { Navigate, useLocation } from 'react-router-dom';
// --- END OF FIX ---
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // While the auth state is loading, you can show a spinner or null
    return <div className="flex items-center justify-center h-screen">Loading Application...</div>;
  }

  if (!user) {
    // If the user is not logged in, redirect them to the login page
    // We also save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is logged in, show the page they requested
  return children;
};

export default ProtectedRoute;
