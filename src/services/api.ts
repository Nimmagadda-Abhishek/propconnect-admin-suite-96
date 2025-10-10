import axios from 'axios';

const API_BASE_URL = 'https://b39ad0aff255.ngrok-free.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const authData = localStorage.getItem('propconnect_admin_auth');
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('propconnect_admin_auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/api/admin/dashboard/stats'),
};

// Agents API
export const agentsAPI = {
  getAll: () => api.get('/api/admin/agents'),
  create: (data: any) => api.post('/api/admin/agents', data),
  update: (id: number, data: any) => api.put(`/api/admin/agents/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/agents/${id}`),
};

// Properties API
export const propertiesAPI = {
  getAll: (params?: any) => api.get('/api/properties', { params }),
  getById: (id: number) => api.get(`/api/properties/${id}`),
  getByAgent: (agentId: number) => api.get(`/api/properties/agent/${agentId}`),
  update: (id: number, formData: FormData) => api.put(`/api/properties/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id: number) => api.delete(`/api/properties/${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/api/admin/users'),
};

// Inquiries API
export const inquiriesAPI = {
  getAll: () => api.get('/api/admin/inquiries'),
  updateStatus: (id: number, status: string, response?: string) => 
    api.put(`/api/admin/inquiries/${id}/status?status=${status}${response ? `&response=${encodeURIComponent(response)}` : ''}`),
};

export default api;
