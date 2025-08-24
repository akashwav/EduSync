// File: client/src/api/facultyApi.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/faculty';

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

export const getFaculty = () => apiClient.get('/');
export const createFaculty = (facultyData) => apiClient.post('/', facultyData);
export const deleteFaculty = (id) => apiClient.delete(`/${id}`);