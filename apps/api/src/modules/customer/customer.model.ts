import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface ICustomer extends Document {
  storeId: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone: string;
  addresses: Array<{
    label: string;
    address: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
    isDefault: boolean;
  }>;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: Date;
  tags: string[];
  notes?: string;
  source: 'website' | 'whatsapp' | 'instagram' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema(
  {
    label: { type: String, default: 'Home' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    postalCode: String,
    country: { type: String, default: 'Nepal' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const customerSchema = new Schema<ICustomer>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    addresses: [addressSchema],
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    lastOrderAt: Date,
    tags: [{ type: String }],
    notes: String,
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'instagram', 'manual'],
      default: 'website',
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ storeId: 1, phone: 1 }, { unique: true });
customerSchema.index({ storeId: 1, email: 1 });
customerSchema.index({ storeId: 1, name: 'text' });

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
