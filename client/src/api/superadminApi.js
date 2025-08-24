// File: client/src/api/superadminApi.js

import axios from 'axios';

const API_URL = 'https://edusync-api-yyjg.onrender.com/api/superadmin';

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

export const onboardCollege = (collegeData) => {
  return apiClient.post('/onboard-college', collegeData);
};

// We will need a way to view all colleges later
// export const getAllColleges = () => apiClient.get('/colleges');