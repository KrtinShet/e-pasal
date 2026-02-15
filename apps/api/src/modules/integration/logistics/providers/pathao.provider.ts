import { env } from '../../../../config/env.js';
import { redis } from '../../../../lib/redis.js';
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

const PATHAO_BASE_URL = 'https://api-hermes.pathao.com';
const PATHAO_SANDBOX_URL = 'https://courier-api-hermes.sandbox.pathao.com';
const TOKEN_CACHE_KEY = 'pathao:access_token';
const CITIES_CACHE_KEY = 'pathao:cities';
const ZONES_CACHE_PREFIX = 'pathao:zones:';
const AREAS_CACHE_PREFIX = 'pathao:areas:';
const CACHE_TTL = 86400; // 24 hours

function getBaseUrl(): string {
  return env.NODE_ENV === 'production' ? PATHAO_BASE_URL : PATHAO_SANDBOX_URL;
}

async function getAccessToken(): Promise<string> {
  const cached = await redis.get(TOKEN_CACHE_KEY);
  if (cached) return cached;

  const response = await fetch(`${getBaseUrl()}/aladdin/api/v1/issue-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.PATHAO_CLIENT_ID,
      client_secret: env.PATHAO_CLIENT_SECRET,
      username: env.PATHAO_USERNAME,
      password: env.PATHAO_PASSWORD,
      grant_type: 'password',
    }),
  });

  if (!response.ok) {
    throw new Error(`Pathao auth failed: ${response.statusText}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  const ttl = Math.max(data.expires_in - 300, 60); // refresh 5 min early
  await redis.setex(TOKEN_CACHE_KEY, ttl, data.access_token);
  return data.access_token;
}

async function pathaoFetch(path: string, options: RequestInit = {}): Promise<unknown> {
  const token = await getAccessToken();
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    await redis.del(TOKEN_CACHE_KEY);
    const newToken = await getAccessToken();
    const retry = await fetch(`${getBaseUrl()}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
        ...options.headers,
      },
    });
    return retry.json();
  }

  return response.json();
}

const PATHAO_STATUS_MAP: Record<string, string> = {
  Pending: 'pending',
  'Picked Up': 'picked_up',
  'In Transit': 'in_transit',
  'Out for Delivery': 'out_for_delivery',
  Delivered: 'delivered',
  Return: 'returned',
  'Return In Transit': 'returned',
  Cancelled: 'cancelled',
};

class PathaoProvider implements LogisticsProvider {
  readonly name = 'pathao';

  async getServiceAreas(): Promise<ServiceArea[]> {
    const cached = await redis.get(CITIES_CACHE_KEY);
    if (cached) return JSON.parse(cached) as ServiceArea[];

    const data = (await pathaoFetch('/aladdin/api/v1/countries/1/city-list')) as {
      data: { data: { city_id: number; city_name: string }[] };
    };

    const cities = data.data.data;
    const areas: ServiceArea[] = [];

    for (const city of cities) {
      const zonesData = (await pathaoFetch(`/aladdin/api/v1/cities/${city.city_id}/zone-list`)) as {
        data: { data: { zone_id: number; zone_name: string }[] };
      };

      const zones = [];
      for (const zone of zonesData.data.data) {
        const areasData = (await pathaoFetch(
          `/aladdin/api/v1/zones/${zone.zone_id}/area-list`
        )) as { data: { data: { area_id: number; area_name: string }[] } };

        zones.push({
          name: zone.zone_name,
          areas: areasData.data.data.map((a: { area_name: string }) => a.area_name),
        });

        await redis.setex(
          `${AREAS_CACHE_PREFIX}${zone.zone_id}`,
          CACHE_TTL,
          JSON.stringify(areasData.data.data)
        );
      }

      await redis.setex(
        `${ZONES_CACHE_PREFIX}${city.city_id}`,
        CACHE_TTL,
        JSON.stringify(zonesData.data.data)
      );

      areas.push({ city: city.city_name, zones });
    }

    await redis.setex(CITIES_CACHE_KEY, CACHE_TTL, JSON.stringify(areas));
    return areas;
  }

  async calculateRate(params: RateParams): Promise<RateResult> {
    try {
      const data = (await pathaoFetch('/aladdin/api/v1/merchant/price-plan', {
        method: 'POST',
        body: JSON.stringify({
          store_id: params.pickupCity,
          item_type: params.itemType === 'document' ? 1 : 2,
          delivery_type: 48,
          item_weight: params.weight,
          recipient_city: params.deliveryCity,
          recipient_zone: params.deliveryZone,
        }),
      })) as { data: { price: number } };

      return {
        success: true,
        amount: data.data.price,
        currency: 'NPR',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Rate calculation failed',
      };
    }
  }

  async createShipment(params: ShipmentParams): Promise<ShipmentResult> {
    try {
      const data = (await pathaoFetch('/aladdin/api/v1/orders', {
        method: 'POST',
        body: JSON.stringify({
          store_id: params.pickupStore.city,
          merchant_order_id: params.orderId,
          recipient_name: params.recipient.name,
          recipient_phone: params.recipient.phone,
          recipient_address: params.recipient.address,
          recipient_city: params.recipient.city,
          recipient_zone: params.recipient.zone,
          recipient_area: params.recipient.area,
          delivery_type: params.deliveryType === 'express' ? 12 : 48,
          item_type: params.package.itemType === 'document' ? 1 : 2,
          special_instruction: params.specialInstructions || '',
          item_quantity: params.package.quantity,
          item_weight: params.package.weight,
          item_description: params.package.description,
          amount_to_collect: params.codAmount || 0,
        }),
      })) as {
        data: {
          consignment_id: string;
          delivery_fee: number;
        };
      };

      return {
        success: true,
        consignmentId: data.data.consignment_id,
        trackingNumber: data.data.consignment_id,
        trackingUrl: `https://merchant.pathao.com/tracking?consignment_id=${data.data.consignment_id}`,
        cost: data.data.delivery_fee,
      };
    } catch (error) {
      return {
        success: false,
        consignmentId: '',
        error: error instanceof Error ? error.message : 'Shipment creation failed',
      };
    }
  }

  async getTracking(trackingId: string): Promise<TrackingResult> {
    try {
      const data = (await pathaoFetch(`/aladdin/api/v1/orders/${trackingId}/info`)) as {
        data: {
          order_status: string;
          updated_at: string;
        };
      };

      return {
        success: true,
        consignmentId: trackingId,
        status: PATHAO_STATUS_MAP[data.data.order_status] || data.data.order_status,
      };
    } catch (error) {
      return {
        success: false,
        consignmentId: trackingId,
        status: 'unknown',
        error: error instanceof Error ? error.message : 'Tracking failed',
      };
    }
  }

  async cancelShipment(trackingId: string): Promise<CancelResult> {
    try {
      await pathaoFetch(`/aladdin/api/v1/orders/${trackingId}/cancel`, {
        method: 'POST',
      });
      return { success: true, message: 'Shipment cancelled' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cancellation failed',
      };
    }
  }

  async handleWebhook(payload: unknown): Promise<LogisticsWebhookResult> {
    const data = payload as {
      consignment_id?: string;
      order_status?: string;
      updated_at?: string;
      cod_amount_collected?: number;
    };

    if (!data.consignment_id || !data.order_status) {
      return { verified: false, consignmentId: '', status: '' };
    }

    return {
      verified: true,
      consignmentId: data.consignment_id,
      status: PATHAO_STATUS_MAP[data.order_status] || data.order_status,
      timestamp: data.updated_at ? new Date(data.updated_at) : new Date(),
      raw: payload,
    };
  }
}

export const pathaoProvider = new PathaoProvider();
