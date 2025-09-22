import axios from 'axios';
import { ApiResponse, AuthResponse, LoginForm, RegisterForm } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginForm): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data!;
  },

  register: async (data: RegisterForm): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data!;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<{ user: any }>>('/auth/me');
    return response.data.data!.user;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get<ApiResponse<{ users: any[] }>>('/users');
    return response.data.data!.users;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<{ user: any }>>(`/users/${id}`);
    return response.data.data!.user;
  },

  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<{ user: any }>>(`/users/${id}`, data);
    return response.data.data!.user;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/users/${id}`);
    return response.data.message;
  },
};

// Warehouses API
export const warehousesAPI = {
  getAll: async () => {
    const response = await api.get<ApiResponse<{ warehouses: any[] }>>('/warehouse');
    return response.data.data!.warehouses;
  },

  create: async (data: any) => {
    const response = await api.post<ApiResponse<{ warehouse: any }>>('/warehouse', data);
    return response.data.data!.warehouse;
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<{ inventory: any[] }>>('/inventory', { params });
    return response.data.data!.inventory;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<{ inventory: any }>>(`/inventory/${id}`);
    return response.data.data!.inventory;
  },

  create: async (data: any) => {
    const response = await api.post<ApiResponse<{ inventory: any }>>('/inventory', data);
    return response.data.data!.inventory;
  },

  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<{ inventory: any }>>(`/inventory/${id}`, data);
    return response.data.data!.inventory;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/inventory/${id}`);
    return response.data.message;
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<{ orders: any[] }>>('/orders', { params });
    return response.data.data!.orders;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<{ order: any }>>(`/orders/${id}`);
    return response.data.data!.order;
  },

  create: async (data: any) => {
    const response = await api.post<ApiResponse<{ order: any }>>('/orders', data);
    return response.data.data!.order;
  },

  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<{ order: any }>>(`/orders/${id}`, data);
    return response.data.data!.order;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/orders/${id}`);
    return response.data.message;
  },
};

// Reports API
export const reportsAPI = {
  getMetrics: async (period?: string) => {
    const response = await api.get<ApiResponse<{ metrics: any }>>('/reports/metrics', { 
      params: { period } 
    });
    return response.data.data!.metrics;
  },

  getTopProducts: async (period?: string, limit?: number) => {
    const response = await api.get<ApiResponse<{ topProducts: any[] }>>('/reports/top-products', { 
      params: { period, limit } 
    });
    return response.data.data!.topProducts;
  },

  getWarehousePerformance: async (period?: string) => {
    const response = await api.get<ApiResponse<{ warehousePerformance: any[] }>>('/reports/warehouse-performance', { 
      params: { period } 
    });
    return response.data.data!.warehousePerformance;
  },

  getOrderStatus: async (period?: string) => {
    const response = await api.get<ApiResponse<{ orderStatus: any[] }>>('/reports/order-status', { 
      params: { period } 
    });
    return response.data.data!.orderStatus;
  },

  getInventoryLevels: async () => {
    const response = await api.get<ApiResponse<{ inventoryLevels: any[] }>>('/reports/inventory-levels');
    return response.data.data!.inventoryLevels;
  },

  getActivitySummary: async (period?: string) => {
    const response = await api.get<ApiResponse<{ recentActivities: any[], actionCounts: any[] }>>('/reports/activity-summary', { 
      params: { period } 
    });
    return response.data.data!;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;

