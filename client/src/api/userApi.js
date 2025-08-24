// File: client/src/api/userApi.js

import axios from 'axios';

const API_URL = 'https://edusync-api-yyjg.onrender.com/api/users';

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

export const getUsers = () => apiClient.get('/');
export const createUser = (userData) => apiClient.post('/', userData);