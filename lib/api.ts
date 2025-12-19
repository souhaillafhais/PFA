import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  register: async (data: {
    email: string;
    password: string;
    telephone: string;
    nomComplet: string;
  }) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async (id: number) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
  updateProfile: async (id: number, data: any) => {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  },
  getUserIncidents: async (id: number) => {
    const response = await api.get(`/api/users/${id}/incidents`);
    return response.data;
  },
};

// Incident API
export const incidentAPI = {
  create: async (data: {
    type: string;
    sousType: string;
    latitude: number;
    longitude: number;
    adresse?: string;
    description: string;
    nombreVictimes?: number;
    niveauDanger?: number;
  }) => {
    const response = await api.post('/api/incidents', data);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/incidents/${id}`);
    return response.data;
  },
  getByType: async (type: string) => {
    const response = await api.get(`/api/incidents?type=${type}`);
    return response.data;
  },
  getUserIncidents: async (userId: string) => {
    const response = await api.get(`/api/incidents/utilisateur/${userId}`);
    return response.data;
  },
  updateStatus: async (id: number, statut: string) => {
    const response = await api.patch(`/api/incidents/${id}/statut?statut=${statut}`);
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getAlerts: async (minimumLevel?: string, uniquementActives: boolean = false) => {
    const params = new URLSearchParams();
    if (minimumLevel) params.append('minimumLevel', minimumLevel);
    params.append('uniquementActives', uniquementActives.toString());
    const response = await api.get(`/api/notifications?${params.toString()}`);
    return response.data;
  },
  getAlert: async (id: number) => {
    const response = await api.get(`/api/notifications/${id}`);
    return response.data;
  },
  createAlert: async (data: any) => {
    const response = await api.post('/api/notifications', data);
    return response.data;
  },
  updateAlert: async (id: number, data: any) => {
    const response = await api.put(`/api/notifications/${id}`, data);
    return response.data;
  },
  getGuides: async () => {
    const response = await api.get('/api/guides');
    return response.data;
  },
};

