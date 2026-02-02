export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'merchant' | 'staff' | 'admin';
  storeId?: string;
}

export interface Store {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  description?: string;
  logo?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'free' | 'starter' | 'business' | 'platinum';
  settings: StoreSettings;
}

export interface StoreSettings {
  currency: string;
  timezone: string;
  language: string;
  theme: {
    primaryColor: string;
    accentColor: string;
  };
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: 'draft' | 'active' | 'archived';
}

export interface Order {
  id: string;
  storeId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shipping: ShippingAddress;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_for_pickup'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'cod' | 'esewa' | 'khalti' | 'fonepay' | 'bank_transfer';

export interface Customer {
  id: string;
  storeId: string;
  name: string;
  email?: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
}
