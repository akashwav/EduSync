// File: client/src/api/classroomApi.js

import axios from 'axios';

const API_URL = 'https://edusync-api-yyjg.onrender.com/api/classrooms';

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

export const getClassrooms = () => apiClient.get('/');
export const createClassroom = (classroomData) => apiClient.post('/', classroomData);
export const deleteClassroom = (id) => apiClient.delete(`/${id}`);