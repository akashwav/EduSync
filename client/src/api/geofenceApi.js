import axios from 'axios';

const API_URL = 'https://edusync-api-yyjg.onrender.com/api/geofence';

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

export const getGeofence = () => apiClient.get('/');
export const setGeofence = (geofenceData) => apiClient.post('/', geofenceData);