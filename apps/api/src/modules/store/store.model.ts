import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IStore extends Document {
  name: string;
  subdomain: string;
  customDomain?: string;
  description?: string;
  logo?: string;
  favicon?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'free' | 'starter' | 'business' | 'platinum';
  settings: {
    currency: string;
    timezone: string;
    language: string;
    theme: {
      primaryColor: string;
      accentColor: string;
    };
  };
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  integrations: {
    payments: string[];
    logistics: string[];
    messaging: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subdomain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    customDomain: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: String,
    logo: String,
    favicon: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    plan: {
      type: String,
      enum: ['free', 'starter', 'business', 'platinum'],
      default: 'free',
    },
    settings: {
      currency: { type: String, default: 'NPR' },
      timezone: { type: String, default: 'Asia/Kathmandu' },
      language: { type: String, default: 'en' },
      theme: {
        primaryColor: { type: String, default: '#2563eb' },
        accentColor: { type: String, default: '#f59e0b' },
      },
    },
    contact: {
      email: String,
      phone: String,
      address: String,
    },
    social: {
      facebook: String,
      instagram: String,
      tiktok: String,
    },
    integrations: {
      payments: [{ type: String }],
      logistics: [{ type: String }],
      messaging: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

storeSchema.index({ subdomain: 1 });
storeSchema.index({ customDomain: 1 });
storeSchema.index({ status: 1 });

export const Store = mongoose.model<IStore>('Store', storeSchema);
