// File: client/src/api/facultyDashboardApi.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/faculty-dashboard';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const getTodaysSchedule = () => apiClient.get('/schedule');
export const getWeeklySchedule = () => apiClient.get('/weekly-schedule'); // Add this line
export const getSessionDetails = (sessionId) => apiClient.get(`/session/${sessionId}`);
export const getAttendanceRecords = () => apiClient.get('/attendance-records');