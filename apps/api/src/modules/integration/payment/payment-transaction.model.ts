import mongoose, { Schema, type Document } from 'mongoose';

export interface IPaymentTransaction extends Document {
  storeId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  provider: 'esewa' | 'khalti' | 'fonepay';
  transactionId: string;
  idempotencyKey: string;
  amount: number;
  currency: string;
  status: 'pending' | 'initiated' | 'completed' | 'failed' | 'refunded';
  providerResponse?: Record<string, unknown>;
  initiatedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    raw?: Record<string, unknown>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentTransactionSchema = new Schema<IPaymentTransaction>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    provider: { type: String, enum: ['esewa', 'khalti', 'fonepay'], required: true },
    transactionId: { type: String, required: true },
    idempotencyKey: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NPR' },
    status: {
      type: String,
      enum: ['pending', 'initiated', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    providerResponse: { type: Schema.Types.Mixed },
    initiatedAt: Date,
    completedAt: Date,
    failedAt: Date,
    refundedAt: Date,
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        raw: Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

paymentTransactionSchema.index({ storeId: 1, orderId: 1 });
paymentTransactionSchema.index({ storeId: 1, transactionId: 1 });

export const PaymentTransaction = mongoose.model<IPaymentTransaction>(
  'PaymentTransaction',
  paymentTransactionSchema
);
