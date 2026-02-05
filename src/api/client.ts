import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3001/api';

// Create axios instance with token support
export const apiClient = axios.create({
  baseURL: API_BASE,
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
