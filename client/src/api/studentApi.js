// File: client/src/api/studentApi.js
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/students';
const apiClient = axios.create({ baseURL: API_URL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export const getStudents = () => apiClient.get('/');
export const createStudent = (studentData) => apiClient.post('/', studentData);
export const deleteStudent = (id) => apiClient.delete(`/${id}`); // Add this line