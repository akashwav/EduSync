// File: client/src/api/timetableApi.js

import axios from 'axios';

// Base URL for structure-related calls
const STRUCTURE_API_URL = 'http://localhost:5000/api/timetable-structure';
const TIMETABLE_API_URL = 'http://localhost:5000/api/timetable';

const apiClient = axios.create();

// Add the JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// --- Structure API calls ---
export const getClassrooms = () => apiClient.get(`${STRUCTURE_API_URL}/classrooms`);
export const createClassroom = (classroomData) => apiClient.post(`${STRUCTURE_API_URL}/classrooms`, classroomData);
export const getTimeSlots = () => apiClient.get(`${STRUCTURE_API_URL}/timeslots`);
export const createTimeSlot = (timeSlotData) => apiClient.post(`${STRUCTURE_API_URL}/timeslots`, timeSlotData);

// --- Generation & Fetching API calls ---
export const generateTimetable = () => apiClient.post(`${TIMETABLE_API_URL}/generate`);
export const getTimetable = () => apiClient.get(TIMETABLE_API_URL);