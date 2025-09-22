import api from './api';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  product: {
    name: string;
    sku: string;
  };
  location: string;
  quantity: number;
  available: number;
  reserved: number;
  status: string;
  warehouse: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  priority: string;
  totalItems: number;
  totalValue: number;
  createdAt: string;
  assignedTo: string | null;
}

export const dataAPI = {
  // Users API
  users: {
    getAll: async (params?: PaginationParams) => {
      const response = await api.get('/users', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },
  },

  // Inventory API
  inventory: {
    getAll: async (params?: PaginationParams) => {
      const response = await api.get('/inventory', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/inventory/${id}`);
      return response.data;
    },
  },

  // Orders API
  orders: {
    getAll: async (params?: PaginationParams) => {
      const response = await api.get('/orders', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    },
  },
};
