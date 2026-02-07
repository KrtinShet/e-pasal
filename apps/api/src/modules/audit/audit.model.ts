import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IAuditLog extends Document {
  storeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    resourceId: String,
    details: Schema.Types.Mixed,
    ipAddress: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

auditLogSchema.index({ storeId: 1, createdAt: -1 });
auditLogSchema.index({ storeId: 1, resource: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
