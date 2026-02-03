import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  variantId?: mongoose.Types.ObjectId;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface IOrder extends Document {
  storeId: mongoose.Types.ObjectId;
  orderNumber: string;
  customerId?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'ready_for_pickup'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cod' | 'esewa' | 'khalti' | 'fonepay' | 'bank_transfer';
  paymentDetails?: {
    transactionId?: string;
    paidAt?: Date;
    refundedAt?: Date;
  };
  shipping: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
    notes?: string;
  };
  fulfillment?: {
    provider?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
  };
  source: 'website' | 'whatsapp' | 'instagram' | 'manual';
  notes?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    sku: String,
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 },
    image: String,
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'ready_for_pickup',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'esewa', 'khalti', 'fonepay', 'bank_transfer'],
      required: true,
    },
    paymentDetails: {
      transactionId: String,
      paidAt: Date,
      refundedAt: Date,
    },
    shipping: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      postalCode: String,
      country: { type: String, default: 'Nepal' },
      notes: String,
    },
    fulfillment: {
      provider: String,
      trackingNumber: String,
      trackingUrl: String,
      shippedAt: Date,
      deliveredAt: Date,
    },
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'instagram', 'manual'],
      default: 'website',
    },
    notes: String,
    cancelReason: String,
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ storeId: 1, orderNumber: 1 }, { unique: true });
orderSchema.index({ storeId: 1, status: 1 });
orderSchema.index({ storeId: 1, customerId: 1 });
orderSchema.index({ storeId: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
