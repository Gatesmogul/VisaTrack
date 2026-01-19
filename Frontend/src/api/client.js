import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('auth') || sessionStorage.getItem('auth');
      if (raw) {
        const { token } = JSON.parse(raw);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error attaching token to request', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.warn('Unauthorized access - redirecting to login');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
