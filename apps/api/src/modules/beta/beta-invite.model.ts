import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IBetaInvite extends Document {
  email: string;
  name: string;
  phone?: string;
  businessName?: string;
  code: string;
  status: 'pending' | 'sent' | 'accepted' | 'expired';
  userId?: mongoose.Types.ObjectId;
  sentAt?: Date;
  acceptedAt?: Date;
  expiresAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const betaInviteSchema = new Schema<IBetaInvite>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    businessName: { type: String, trim: true },
    code: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'sent', 'accepted', 'expired'],
      default: 'pending',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: Date,
    acceptedAt: Date,
    expiresAt: { type: Date, required: true },
    notes: String,
  },
  { timestamps: true }
);

betaInviteSchema.index({ email: 1 });
betaInviteSchema.index({ code: 1 }, { unique: true });
betaInviteSchema.index({ status: 1 });

export const BetaInvite = mongoose.model<IBetaInvite>('BetaInvite', betaInviteSchema);
