import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle errors globally
    const message = error.response?.data?.message || error.message || 'An error occured.';
    const requiresVerification = error.response?.data?.requiresVerification || false;
    const email = error.response?.data?.email;
    
    console.error('API Error:', {
      status: error.response?.status,
      message,
      url: error.config?.url,
    });

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
      requiresVerification,
      email,
    });
  }
);

export default api;