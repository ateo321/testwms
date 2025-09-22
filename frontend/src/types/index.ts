// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'EMPLOYEE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Warehouse Types
export interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  zones?: Zone[];
  _count?: {
    inventory: number;
    orders: number;
  };
}

export interface Zone {
  id: string;
  name: string;
  description?: string;
  warehouseId: string;
  zoneType: 'RECEIVING' | 'STORAGE' | 'PICKING' | 'PACKING' | 'SHIPPING' | 'RETURNS';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  warehouse?: Warehouse;
  locations?: Location[];
}

export interface Location {
  id: string;
  name: string;
  barcode?: string;
  zoneId: string;
  aisle?: string;
  shelf?: string;
  bin?: string;
  capacity?: number;
  locationType: 'FLOOR' | 'SHELF' | 'RACK' | 'BIN' | 'PALLET';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  zone?: Zone;
}

// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  weight?: number;
  dimensions?: string;
  unitPrice?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface Inventory {
  id: string;
  productId: string;
  warehouseId: string;
  locationId: string;
  quantity: number;
  reservedQty: number;
  availableQty: number;
  minStock: number;
  maxStock?: number;
  lastCountAt?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  warehouse?: Warehouse;
  location?: Location;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  warehouseId: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  status: 'PENDING' | 'PROCESSING' | 'PICKING' | 'PICKED' | 'PACKING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  orderType: 'INBOUND' | 'OUTBOUND' | 'TRANSFER' | 'ADJUSTMENT';
  totalItems: number;
  totalValue: number;
  shippingAddress?: string;
  notes?: string;
  createdById: string;
  assignedToId?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  warehouse?: Warehouse;
  createdBy?: User;
  assignedTo?: User;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  pickedQty: number;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
  order?: Order;
  product?: Product;
}

// API Response Types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
}

export interface CreateOrderForm {
  warehouseId: string;
  customerName: string;
  customerEmail?: string;
  shippingAddress?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  orderType: 'INBOUND' | 'OUTBOUND' | 'TRANSFER' | 'ADJUSTMENT';
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice?: number;
    notes?: string;
  }[];
}

