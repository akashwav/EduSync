// File: client/src/api/reportsApi.js

import axios from 'axios';

const API_URL = 'https://edusync-api-yyjg.onrender.com/api/reports';

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

export const getDefaulterList = (threshold) => {
  return apiClient.get(`/defaulters/${threshold}`);
};

// --- NEW FUNCTION ---
// This function will trigger the download
export const downloadDefaulterList = (threshold) => {
  const token = localStorage.getItem('token');
  // We need to construct the URL and trigger the download manually
  // because we need to pass the auth token.
  const url = `${API_URL}/defaulters/download/${threshold}`;
  
  // Use axios to fetch the file, then create a link to download it
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'blob', // Important to handle the file response
  }).then(response => {
    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: 'text/csv' });
    // Create a link element
    const link = document.createElement('a');
    // Create a URL for the blob
    link.href = window.URL.createObjectURL(blob);
    // Suggest a filename for the download
    link.download = `defaulter-report-${new Date().toISOString().slice(0, 10)}.csv`;
    // Append the link to the body
    document.body.appendChild(link);
    // Programmatically click the link to trigger the download
    link.click();
    // Remove the link from the body
    document.body.removeChild(link);
  });
};
// --- END OF NEW FUNCTION ---