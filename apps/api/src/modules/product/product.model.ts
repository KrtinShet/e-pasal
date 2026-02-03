import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IProductVariant {
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  options: Record<string, string>;
  image?: string;
}

export interface IProduct extends Document {
  storeId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  images: string[];
  categoryId?: mongoose.Types.ObjectId;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  variants: IProductVariant[];
  hasVariants: boolean;
  options: Array<{ name: string; values: string[] }>;
  status: 'draft' | 'active' | 'archived';
  visibility: 'visible' | 'hidden';
  seo: {
    title?: string;
    description?: string;
  };
  tags: string[];
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new Schema<IProductVariant>(
  {
    sku: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    options: { type: Map, of: String },
    image: String,
  },
  { _id: true }
);

const productSchema = new Schema<IProduct>(
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
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    shortDescription: String,
    images: [{ type: String }],
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    sku: String,
    barcode: String,
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    trackInventory: {
      type: Boolean,
      default: true,
    },
    allowBackorder: {
      type: Boolean,
      default: false,
    },
    variants: [productVariantSchema],
    hasVariants: {
      type: Boolean,
      default: false,
    },
    options: [
      {
        name: String,
        values: [String],
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
    },
    visibility: {
      type: String,
      enum: ['visible', 'hidden'],
      default: 'visible',
    },
    seo: {
      title: String,
      description: String,
    },
    tags: [{ type: String }],
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ storeId: 1, slug: 1 }, { unique: true });
productSchema.index({ storeId: 1, status: 1, visibility: 1 });
productSchema.index({ storeId: 1, categoryId: 1 });
productSchema.index({ storeId: 1, name: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
