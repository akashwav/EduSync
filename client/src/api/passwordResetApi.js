// File: client/src/api/passwordResetApi.js

import axios from 'axios';

const API_URL = 'https://edusync-api-yyjg.onrender.com/api/password';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Request a password reset email
export const forgotPassword = (email) => {
  return apiClient.post('/forgot', { email });
};

// Submit the new password with the reset token
export const resetPassword = (token, password) => {
  return apiClient.put(`/reset/${token}`, { password });
};