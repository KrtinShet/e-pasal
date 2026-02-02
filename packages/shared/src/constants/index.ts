export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'ready_for_pickup',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;

export const PAYMENT_METHODS = ['cod', 'esewa', 'khalti', 'fonepay', 'bank_transfer'] as const;

export const PRODUCT_STATUSES = ['draft', 'active', 'archived'] as const;

export const STORE_PLANS = ['free', 'starter', 'business', 'platinum'] as const;

export const PLAN_LIMITS = {
  free: {
    products: 50,
    orders: 100,
    storage: 500, // MB
    staff: 1,
  },
  starter: {
    products: 500,
    orders: 1000,
    storage: 2000,
    staff: 3,
  },
  business: {
    products: 5000,
    orders: 10000,
    storage: 10000,
    staff: 10,
  },
  platinum: {
    products: -1, // unlimited
    orders: -1,
    storage: 50000,
    staff: -1,
  },
} as const;

export const SUPPORTED_CURRENCIES = ['NPR', 'USD', 'INR'] as const;

export const DEFAULT_CURRENCY = 'NPR';

export const DEFAULT_TIMEZONE = 'Asia/Kathmandu';
