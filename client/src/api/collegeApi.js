// File: client/src/api/collegeApi.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/college';

// Helper to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Create an Axios instance with default headers
const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// --- API Functions ---

// Get college details
const getCollege = () => {
  return apiClient.get('/');
};

// Create or update college details
const upsertCollege = (collegeData) => {
  return apiClient.post('/', collegeData);
};


export {
  getCollege,
  upsertCollege,
};