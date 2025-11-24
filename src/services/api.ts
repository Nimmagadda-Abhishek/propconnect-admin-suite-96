import axios from 'axios';



<<<<<<< Updated upstream
<<<<<<< Updated upstream
const API_BASE_URL = 'https://3b0024836e23.ngrok-free.app';
=======
const API_BASE_URL = 'https://23adff71a200.ngrok-free.app';
>>>>>>> Stashed changes
=======
const API_BASE_URL = 'https://23adff71a200.ngrok-free.app';
>>>>>>> Stashed changes


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

// Auth API
export const authAPI = {
  login: (data: { username: string; password: string }) => api.post('/api/auth/admin/login', data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/api/admin/dashboard/stats'),
};

// Agents API
export const agentsAPI = {
  getAll: () => api.get('/api/admin/agents'),
  getById: (id: number) => {
    console.log('Fetching agent details for ID:', id);
    return api.get(`/api/admin/agents/${id}`).then(response => {
      console.log('Response status:', response.status);
      console.log('Response data type:', typeof response.data);
      console.log('Response data keys:', Object.keys(response.data));
      console.log('Received agent data:', response.data);
      return response;
    });
  },
  create: (formData: FormData) => api.post('/api/admin/agents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id: number, data: Record<string, unknown>) => api.put(`/api/admin/agents/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/agents/${id}`),
};

// Properties API
export const propertiesAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/api/properties', { params }),
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
  getAll: () => api.get('/api/inquiries'),
  updateStatus: (id: number, status: string, response?: string) =>
    api.put(`/api/inquiries/${id}/status?status=${status}${response ? `&response=${encodeURIComponent(response)}` : ''}`),
};

export default api;
