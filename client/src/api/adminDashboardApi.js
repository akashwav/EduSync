// File: client/src/api/adminDashboardApi.js

import axios from 'axios';

const API_URL = 'https://edusync-api-yyjg.onrender.com/api/admin-dashboard';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add the JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardStats = () => apiClient.get('/stats');
export const completeSetup = () => apiClient.post('/complete-setup');
export const getAttendanceTrends = () => apiClient.get('/attendance-trends'); // Add this line