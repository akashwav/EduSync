// File: client/src/api/notificationApi.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

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

export const sendDefaulterAlerts = (threshold) => {
  return apiClient.post('/send-defaulter-alerts', { threshold });
};