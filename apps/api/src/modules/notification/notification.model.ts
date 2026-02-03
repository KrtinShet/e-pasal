import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export type NotificationType =
  | 'order_created'
  | 'order_updated'
  | 'order_cancelled'
  | 'low_stock'
  | 'out_of_stock'
  | 'payment_received'
  | 'new_customer';

export interface INotification extends Document {
  storeId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'order_created',
        'order_updated',
        'order_cancelled',
        'low_stock',
        'out_of_stock',
        'payment_received',
        'new_customer',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ storeId: 1, read: 1 });
notificationSchema.index({ storeId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
