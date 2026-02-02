import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  storeId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  variantId?: mongoose.Types.ObjectId;
  sku?: string;
  available: number;
  reserved: number;
  committed: number;
  incoming: number;
  lowStockThreshold: number;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
    },
    sku: String,
    available: {
      type: Number,
      default: 0,
      min: 0,
    },
    reserved: {
      type: Number,
      default: 0,
      min: 0,
    },
    committed: {
      type: Number,
      default: 0,
      min: 0,
    },
    incoming: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ storeId: 1, productId: 1, variantId: 1 }, { unique: true });
inventorySchema.index({ storeId: 1, sku: 1 });

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
