// File: client/src/api/attendanceApi.js

import axios from 'axios';

const API_URL = 'https://edusync-api-yyjg.onrender.com/api/attendance';

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

// Get the list of students for a specific class session
export const getStudentsForSession = (timetableEntryId) => {
  return apiClient.get(`/session/${timetableEntryId}`);
};

// Submit the attendance data
export const submitAttendance = (attendancePayload) => {
  return apiClient.post('/submit', attendancePayload);
};

export const verifyAndSubmitAttendance = (verificationData) => {
  return apiClient.post('/verify', verificationData);
};

export const detectAnomalies = (section) => {
    return apiClient.post('/anomalies', { section });
};

export const getAttendanceForSession = (timetableEntryId, date) => {
    return apiClient.get(`/records/${timetableEntryId}/${date}`);
};

export const checkIn = (sessionId) => apiClient.post('/check-in', { sessionId });