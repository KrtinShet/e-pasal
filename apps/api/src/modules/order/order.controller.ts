import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { orderService } from './order.service.js';

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().min(1),
      })
    )
    .min(1),
  shipping: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().email().optional(),
    address: z.string(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().default('Nepal'),
    notes: z.string().optional(),
  }),
  paymentMethod: z.enum(['cod', 'esewa', 'khalti', 'fonepay', 'bank_transfer']),
  source: z.enum(['website', 'whatsapp', 'instagram', 'manual']).optional(),
  notes: z.string().optional(),
});

const listQuerySchema = z.object({
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  customerId: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  paymentMethod: z.string().optional(),
  source: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

const updateStatusSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'ready_for_pickup',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ]),
  note: z.string().optional(),
  cancelReason: z.string().optional(),
});

const updateFulfillmentSchema = z.object({
  provider: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url().optional(),
});

const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
  transactionId: z.string().optional(),
  note: z.string().optional(),
});

const addNoteSchema = z.object({
  note: z.string().min(1),
});

export class OrderController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createOrderSchema.parse(req.body);
      const order = await orderService.create(req.user!.storeId!, data);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listQuerySchema.parse(req.query);
      const result = await orderService.list({
        storeId: req.user!.storeId!,
        ...query,
      });

      res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getById(req.user!.storeId!, req.params.id);

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, note, cancelReason } = updateStatusSchema.parse(req.body);
      const order = await orderService.updateStatus(req.user!.storeId!, req.params.id, status, {
        note,
        cancelReason,
        changedBy: req.user!.id,
      });

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateFulfillment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateFulfillmentSchema.parse(req.body);
      const order = await orderService.updateFulfillment(
        req.user!.storeId!,
        req.params.id,
        data,
        req.user!.id
      );

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentStatus, transactionId, note } = updatePaymentStatusSchema.parse(req.body);
      const order = await orderService.updatePaymentStatus(
        req.user!.storeId!,
        req.params.id,
        paymentStatus,
        { transactionId, note, changedBy: req.user!.id }
      );

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { note } = addNoteSchema.parse(req.body);
      const order = await orderService.addNote(
        req.user!.storeId!,
        req.params.id,
        note,
        req.user!.id
      );

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
