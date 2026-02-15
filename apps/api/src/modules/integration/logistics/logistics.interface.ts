export interface ServiceArea {
  city: string;
  zones?: { name: string; areas?: string[] }[];
}

export interface RateParams {
  pickupCity: string;
  pickupZone?: string;
  deliveryCity: string;
  deliveryZone?: string;
  weight: number;
  itemType: 'document' | 'parcel';
  codAmount?: number;
}

export interface RateResult {
  success: boolean;
  amount?: number;
  currency?: string;
  estimatedDays?: number;
  error?: string;
}

export interface ShipmentParams {
  orderId: string;
  pickupStore: {
    name: string;
    address: string;
    city: string;
    zone?: string;
    area?: string;
    phone: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
    city: string;
    zone?: string;
    area?: string;
  };
  package: {
    weight: number;
    itemType: 'document' | 'parcel';
    description: string;
    quantity: number;
  };
  codAmount?: number;
  deliveryType?: 'normal' | 'express';
  specialInstructions?: string;
}

export interface ShipmentResult {
  success: boolean;
  consignmentId: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  cost?: number;
  error?: string;
}

export interface TrackingResult {
  success: boolean;
  consignmentId: string;
  status: string;
  statusTimeline?: { status: string; timestamp: Date; note?: string }[];
  currentLocation?: string;
  estimatedDelivery?: Date;
  error?: string;
}

export interface CancelResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface LogisticsWebhookResult {
  verified: boolean;
  consignmentId: string;
  status: string;
  timestamp?: Date;
  note?: string;
  raw?: unknown;
}

export interface LogisticsProvider {
  readonly name: string;
  getServiceAreas(): Promise<ServiceArea[]>;
  calculateRate(params: RateParams): Promise<RateResult>;
  createShipment(params: ShipmentParams): Promise<ShipmentResult>;
  getTracking(trackingId: string): Promise<TrackingResult>;
  cancelShipment(trackingId: string): Promise<CancelResult>;
  handleWebhook(payload: unknown): Promise<LogisticsWebhookResult>;
}
