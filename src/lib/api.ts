import axios from 'axios';

// Ensure API_URL has proper protocol
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (!envUrl) {
    return 'http://localhost:5000/api';
  }
  
  // If URL doesn't start with http:// or https://, add https://
  if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
    return `https://${envUrl}`;
  }
  
  return envUrl;
};

const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: import.meta.env.DEV, // Only send credentials in development
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       window.location.href = '/admin/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default api;