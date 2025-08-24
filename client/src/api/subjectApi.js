// File: client/src/api/subjectApi.js

import axios from 'axios';

// The base URL will be for courses, as subjects are a nested resource
const API_URL = 'https://edusync-api-yyjg.onrender.com/api/courses';

const apiClient = axios.create();

// Add the JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Get all subjects for a specific course
export const getSubjectsByCourse = (courseId) => {
  return apiClient.get(`${API_URL}/${courseId}/subjects`);
};

// Add a new subject to a specific course
export const addSubject = (courseId, subjectData) => {
  return apiClient.post(`${API_URL}/${courseId}/subjects`, subjectData);
};