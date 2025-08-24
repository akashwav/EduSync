// File: client/src/api/courseApi.js

import axios from 'axios';

const API_URL = 'https://edusync-api-yyjg.onrender.com/api/courses';

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

export const getCourses = () => apiClient.get('/');
export const createCourse = (courseData) => apiClient.post('/', courseData);
export const deleteCourse = (id) => apiClient.delete(`/${id}`);