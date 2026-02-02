import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { orderService } from './order.service.js';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().min(1),
  })).min(1),
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
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

const updateStatusSchema = z.object({
  status: z.enum([
    'pending', 'confirmed', 'processing', 'ready_for_pickup',
    'shipped', 'delivered', 'cancelled', 'refunded',
  ]),
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
      const order = await orderService.getById(
        req.user!.storeId!,
        req.params.id
      );

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
      const { status } = updateStatusSchema.parse(req.body);
      const order = await orderService.updateStatus(
        req.user!.storeId!,
        req.params.id,
        status
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
