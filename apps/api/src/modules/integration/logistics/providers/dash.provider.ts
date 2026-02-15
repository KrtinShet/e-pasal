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
  'Dash provider not yet implemented. Contact dashlogistics.com.np for API access.';

class DashProvider implements LogisticsProvider {
  readonly name = 'dash';

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

export const dashProvider = new DashProvider();
