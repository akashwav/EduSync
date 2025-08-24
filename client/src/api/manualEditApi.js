// File: client/src/api/manualEditApi.js

import axios from 'axios';

const API_URL = 'https://edusync-api-yyjg.onrender.com/api/timetable/edit';

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

export const updateTimetableEntry = (entryId, newSlotData) => {
  return apiClient.put(`/${entryId}`, newSlotData);
};