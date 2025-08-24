// File: client/src/api/studentDashboardApi.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/student-dashboard';

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
export const getAttendanceSummary = () => apiClient.get('/attendance-summary');
export const getWeeklySchedule = () => apiClient.get('/weekly-schedule'); // Add this line
export const getAttendanceHistory = () => apiClient.get('/attendance-history');