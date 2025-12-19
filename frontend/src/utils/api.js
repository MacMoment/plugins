import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.patch('/profile', data),
  getStats: () => api.get('/profile/stats')
};

// Plugins API
export const pluginsAPI = {
  generate: (data) => api.post('/plugins/generate', data),
  getAll: () => api.get('/plugins'),
  getById: (id) => api.get(`/plugins/${id}`),
  getHistory: (id) => api.get(`/plugins/${id}/history`),
  improve: (id, data) => api.post(`/plugins/${id}/improve`, data),
  fix: (id, data) => api.post(`/plugins/${id}/fix`, data),
  download: (id) => api.get(`/plugins/${id}/download`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/plugins/${id}`),
  update: (id, data) => api.patch(`/plugins/${id}`, data)
};

// Payment API
export const paymentAPI = {
  getPackages: () => api.get('/payment/packages'),
  createCheckout: (data) => api.post('/payment/create-checkout', data),
  addTokensManual: (data) => api.post('/payment/add-tokens-manual', data),
  getBalance: () => api.get('/payment/balance'),
  getTransactions: () => api.get('/payment/transactions')
};
