import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IFeedback extends Document {
  storeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'bug' | 'ux' | 'feature' | 'general';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'triaged' | 'in_progress' | 'resolved' | 'wontfix';
  title: string;
  description: string;
  screenshot?: string;
  assignee?: string;
  resolution?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['bug', 'ux', 'feature', 'general'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'triaged', 'in_progress', 'resolved', 'wontfix'],
      default: 'open',
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    screenshot: String,
    assignee: String,
    resolution: String,
    resolvedAt: Date,
  },
  { timestamps: true }
);

feedbackSchema.index({ storeId: 1, status: 1 });
feedbackSchema.index({ type: 1 });
feedbackSchema.index({ priority: 1, status: 1 });

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
