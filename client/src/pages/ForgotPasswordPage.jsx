// File: client/src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/passwordResetApi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await forgotPassword(email);
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
        <p className="text-center text-gray-600 text-sm mb-6">Enter your email address and we will send you a link to reset your password.</p>
        
        {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="email" type="email" placeholder="your.email@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-blue-300"
              type="submit" disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Remember your password? <Link to="/login" className="text-blue-500 hover:text-blue-700">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;