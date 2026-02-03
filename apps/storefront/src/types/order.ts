export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  state?: string;
  country?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  quantity: number;
  sku?: string;
  variantName?: string;
}

export interface Order {
  id: string;
  storeId: string;
  orderNumber: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'esewa' | 'khalti' | 'stripe';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod';
  notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  };
}
