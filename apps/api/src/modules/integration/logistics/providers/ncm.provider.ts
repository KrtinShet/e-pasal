import type {
  RateParams,
  RateResult,
  ServiceArea,
  CancelResult,
  ShipmentParams,
  ShipmentResult,
  TrackingResult,
  LogisticsProvider,
  LogisticsWebhookResult,
} from '../logistics.interface.js';

const NOT_IMPLEMENTED =
  'NCM provider not yet implemented. Contact support@nepalcanmove.com for API access.';

class NcmProvider implements LogisticsProvider {
  readonly name = 'ncm';

  async getServiceAreas(): Promise<ServiceArea[]> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async calculateRate(_params: RateParams): Promise<RateResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async createShipment(_params: ShipmentParams): Promise<ShipmentResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async getTracking(_trackingId: string): Promise<TrackingResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async cancelShipment(_trackingId: string): Promise<CancelResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async handleWebhook(_payload: unknown): Promise<LogisticsWebhookResult> {
    throw new Error(NOT_IMPLEMENTED);
  }
}

export const ncmProvider = new NcmProvider();
