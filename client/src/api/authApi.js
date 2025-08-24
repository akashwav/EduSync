// File: client/src/api/authApi.js

import axios from 'axios';

// This creates a dedicated client that ALWAYS points to your backend server
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // The correct backend URL
});

// This function will now correctly send a POST request to http://localhost:5000/api/auth/register
export const registerAdmin = (userData) => {
  return apiClient.post('/auth/register', userData);
};

// This function will now correctly send a POST request to http://localhost:5000/api/auth/login
export const loginUser = (userData) => {
  return apiClient.post('/auth/login', userData);
};