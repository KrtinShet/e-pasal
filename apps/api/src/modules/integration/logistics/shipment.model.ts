import mongoose, { Schema, type Document } from 'mongoose';

export const SHIPMENT_STATUSES = [
  'pending',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'returned',
  'cancelled',
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const LOGISTICS_PROVIDERS = ['pathao', 'ncm', 'dash'] as const;
export type LogisticsProviderName = (typeof LOGISTICS_PROVIDERS)[number];

export interface IShipment extends Document {
  storeId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  provider: LogisticsProviderName;
  consignmentId: string;
  trackingNumber?: string;
  trackingUrl?: string;
  status: ShipmentStatus;
  pickup: {
    address: string;
    city: string;
    zone?: string;
    area?: string;
    contactPhone: string;
    scheduledAt?: Date;
  };
  delivery: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    zone?: string;
    area?: string;
  };
  package: {
    weight: number;
    itemType: string;
    description: string;
    quantity: number;
  };
  cod: {
    amount: number;
    collected: boolean;
    settledAt?: Date;
  };
  statusHistory: {
    status: ShipmentStatus;
    timestamp: Date;
    note?: string;
    raw?: unknown;
  }[];
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  cost?: number;
  providerResponse?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const shipmentSchema = new Schema<IShipment>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    provider: { type: String, enum: LOGISTICS_PROVIDERS, required: true },
    consignmentId: { type: String, required: true },
    trackingNumber: { type: String },
    trackingUrl: { type: String },
    status: { type: String, enum: SHIPMENT_STATUSES, default: 'pending' },
    pickup: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      zone: { type: String },
      area: { type: String },
      contactPhone: { type: String, required: true },
      scheduledAt: { type: Date },
    },
    delivery: {
      recipientName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zone: { type: String },
      area: { type: String },
    },
    package: {
      weight: { type: Number, required: true },
      itemType: { type: String, required: true },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
    cod: {
      amount: { type: Number, default: 0 },
      collected: { type: Boolean, default: false },
      settledAt: { type: Date },
    },
    statusHistory: [
      {
        status: { type: String, enum: SHIPMENT_STATUSES, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
        raw: { type: Schema.Types.Mixed },
      },
    ],
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },
    cost: { type: Number },
    providerResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

shipmentSchema.index({ storeId: 1, orderId: 1 });
shipmentSchema.index({ storeId: 1, status: 1 });
shipmentSchema.index({ storeId: 1, provider: 1 });
shipmentSchema.index({ storeId: 1, createdAt: -1 });

export const Shipment = mongoose.model<IShipment>('Shipment', shipmentSchema);
