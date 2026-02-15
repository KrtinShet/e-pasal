import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { orderService } from '../../order/order.service.js';

import { getLogisticsProvider, getSupportedProviders } from './logistics.factory.js';
import { Shipment, SHIPMENT_STATUSES, LOGISTICS_PROVIDERS } from './shipment.model.js';

const calculateRateSchema = z.object({
  provider: z.enum(LOGISTICS_PROVIDERS),
  pickupCity: z.string(),
  pickupZone: z.string().optional(),
  deliveryCity: z.string(),
  deliveryZone: z.string().optional(),
  weight: z.number().positive(),
  itemType: z.enum(['document', 'parcel']),
  codAmount: z.number().optional(),
});

const createShipmentSchema = z.object({
  provider: z.enum(LOGISTICS_PROVIDERS),
  orderId: z.string(),
  pickupStore: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    zone: z.string().optional(),
    area: z.string().optional(),
    phone: z.string(),
  }),
  recipient: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    zone: z.string().optional(),
    area: z.string().optional(),
  }),
  package: z.object({
    weight: z.number().positive(),
    itemType: z.enum(['document', 'parcel']),
    description: z.string(),
    quantity: z.number().int().positive(),
  }),
  codAmount: z.number().optional(),
  deliveryType: z.enum(['normal', 'express']).optional(),
  specialInstructions: z.string().optional(),
});

export class LogisticsController {
  async calculateRate(req: Request, res: Response, next: NextFunction) {
    try {
      const data = calculateRateSchema.parse(req.body);
      const provider = getLogisticsProvider(data.provider);
      const result = await provider.calculateRate({
        pickupCity: data.pickupCity,
        pickupZone: data.pickupZone,
        deliveryCity: data.deliveryCity,
        deliveryZone: data.deliveryZone,
        weight: data.weight,
        itemType: data.itemType,
        codAmount: data.codAmount,
      });

      return res.json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }

  async createShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createShipmentSchema.parse(req.body);
      const provider = getLogisticsProvider(data.provider);
      const result = await provider.createShipment(data);

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      const shipment = await Shipment.create({
        storeId: req.user!.storeId,
        orderId: data.orderId,
        provider: data.provider,
        consignmentId: result.consignmentId,
        trackingNumber: result.trackingNumber,
        trackingUrl: result.trackingUrl,
        status: 'pending',
        pickup: {
          address: data.pickupStore.address,
          city: data.pickupStore.city,
          zone: data.pickupStore.zone,
          area: data.pickupStore.area,
          contactPhone: data.pickupStore.phone,
        },
        delivery: {
          recipientName: data.recipient.name,
          phone: data.recipient.phone,
          address: data.recipient.address,
          city: data.recipient.city,
          zone: data.recipient.zone,
          area: data.recipient.area,
        },
        package: data.package,
        cod: { amount: data.codAmount || 0, collected: false },
        statusHistory: [{ status: 'pending', timestamp: new Date() }],
        estimatedDelivery: result.estimatedDelivery,
        cost: result.cost,
        providerResponse: result,
      });

      return res.status(201).json({ success: true, data: shipment });
    } catch (error) {
      return next(error);
    }
  }

  async getTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const { trackingId } = req.params;
      const shipment = await Shipment.findOne({
        storeId: req.user!.storeId,
        $or: [{ consignmentId: trackingId }, { trackingNumber: trackingId }],
      });

      if (!shipment) {
        return res.status(404).json({ success: false, error: 'Shipment not found' });
      }

      const provider = getLogisticsProvider(shipment.provider);
      const tracking = await provider.getTracking(shipment.consignmentId);

      return res.json({ success: true, data: { shipment, tracking } });
    } catch (error) {
      return next(error);
    }
  }

  async listShipments(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, provider, page = '1', limit = '20' } = req.query;
      const filter: Record<string, unknown> = { storeId: req.user!.storeId };

      if (status && SHIPMENT_STATUSES.includes(status as (typeof SHIPMENT_STATUSES)[number])) {
        filter.status = status;
      }
      if (
        provider &&
        LOGISTICS_PROVIDERS.includes(provider as (typeof LOGISTICS_PROVIDERS)[number])
      ) {
        filter.provider = provider;
      }

      const pageNum = Math.max(1, parseInt(page as string, 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));

      const [shipments, total] = await Promise.all([
        Shipment.find(filter)
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .populate('orderId', 'orderNumber'),
        Shipment.countDocuments(filter),
      ]);

      return res.json({
        success: true,
        data: shipments,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
      });
    } catch (error) {
      return next(error);
    }
  }

  async cancelShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const shipment = await Shipment.findOne({ _id: id, storeId: req.user!.storeId });

      if (!shipment) {
        return res.status(404).json({ success: false, error: 'Shipment not found' });
      }

      if (['delivered', 'cancelled'].includes(shipment.status)) {
        return res.status(400).json({ success: false, error: 'Shipment cannot be cancelled' });
      }

      const provider = getLogisticsProvider(shipment.provider);
      const result = await provider.cancelShipment(shipment.consignmentId);

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      shipment.status = 'cancelled';
      shipment.statusHistory.push({ status: 'cancelled', timestamp: new Date() });
      await shipment.save();

      return res.json({ success: true, data: shipment });
    } catch (error) {
      return next(error);
    }
  }

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider: providerName } = req.params;
      const provider = getLogisticsProvider(providerName as (typeof LOGISTICS_PROVIDERS)[number]);
      const result = await provider.handleWebhook(req.body);

      if (!result.verified) {
        return res.status(400).json({ success: false, error: 'Webhook verification failed' });
      }

      const shipment = await Shipment.findOne({ consignmentId: result.consignmentId });
      if (shipment) {
        shipment.status = result.status as (typeof SHIPMENT_STATUSES)[number];
        shipment.statusHistory.push({
          status: result.status as (typeof SHIPMENT_STATUSES)[number],
          timestamp: result.timestamp || new Date(),
          note: result.note,
          raw: result.raw,
        });
        if (result.status === 'delivered') {
          shipment.actualDelivery = result.timestamp || new Date();

          if (shipment.cod.amount > 0 && !shipment.cod.collected) {
            shipment.cod.collected = true;
            shipment.cod.settledAt = result.timestamp || new Date();

            await orderService.updatePaymentStatus(
              shipment.storeId.toString(),
              shipment.orderId.toString(),
              'paid',
              { note: `COD collected via ${providerName}` }
            );
          }
        }
        await shipment.save();
      }

      return res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
      return next(error);
    }
  }

  async getProviders(_req: Request, res: Response, next: NextFunction) {
    try {
      return res.json({ success: true, data: getSupportedProviders() });
    } catch (error) {
      return next(error);
    }
  }

  async markCodCollected(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { note } = req.body || {};

      const shipment = await Shipment.findOne({ _id: id, storeId: req.user!.storeId });
      if (!shipment) {
        return res.status(404).json({ success: false, error: 'Shipment not found' });
      }

      if (shipment.cod.amount === 0) {
        return res.status(400).json({ success: false, error: 'Not a COD shipment' });
      }

      if (shipment.cod.collected) {
        return res.status(400).json({ success: false, error: 'COD already marked as collected' });
      }

      shipment.cod.collected = true;
      shipment.cod.settledAt = new Date();
      shipment.statusHistory.push({
        status: shipment.status,
        timestamp: new Date(),
        note: note || `COD manually marked as collected by merchant`,
      });
      await shipment.save();

      await orderService.updatePaymentStatus(
        shipment.storeId.toString(),
        shipment.orderId.toString(),
        'paid',
        { note: note || 'COD manually reconciled' }
      );

      return res.json({ success: true, data: shipment });
    } catch (error) {
      return next(error);
    }
  }

  async getCodSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = req.user!.storeId;
      const { provider, from, to } = req.query;

      const match: Record<string, unknown> = {
        storeId,
        'cod.amount': { $gt: 0 },
      };

      if (provider) match.provider = provider;
      if (from || to) {
        match.createdAt = {};
        if (from) (match.createdAt as Record<string, unknown>).$gte = new Date(from as string);
        if (to) (match.createdAt as Record<string, unknown>).$lte = new Date(to as string);
      }

      const [summary] = await Shipment.aggregate([
        { $match: match },
        {
          $group: {
            _id: { provider: '$provider', collected: '$cod.collected' },
            total: { $sum: '$cod.amount' },
            count: { $sum: 1 },
          },
        },
      ]);

      const results = await Shipment.aggregate([
        { $match: match },
        {
          $group: {
            _id: { provider: '$provider', collected: '$cod.collected' },
            total: { $sum: '$cod.amount' },
            count: { $sum: 1 },
          },
        },
      ]);

      const byProvider: Record<
        string,
        { pending: number; collected: number; pendingCount: number; collectedCount: number }
      > = {};

      for (const r of results) {
        const prov = r._id.provider;
        if (!byProvider[prov]) {
          byProvider[prov] = { pending: 0, collected: 0, pendingCount: 0, collectedCount: 0 };
        }
        if (r._id.collected) {
          byProvider[prov].collected = r.total;
          byProvider[prov].collectedCount = r.count;
        } else {
          byProvider[prov].pending = r.total;
          byProvider[prov].pendingCount = r.count;
        }
      }

      const totalPending = Object.values(byProvider).reduce((s, p) => s + p.pending, 0);
      const totalCollected = Object.values(byProvider).reduce((s, p) => s + p.collected, 0);

      return res.json({
        success: true,
        data: {
          totalPending,
          totalCollected,
          byProvider,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const logisticsController = new LogisticsController();
