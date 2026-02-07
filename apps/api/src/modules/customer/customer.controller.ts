import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { customerService } from './customer.service.js';

const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  addresses: z
    .array(
      z.object({
        label: z.string().default('Home'),
        address: z.string(),
        city: z.string(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().default('Nepal'),
        isDefault: z.boolean().default(false),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  source: z.enum(['website', 'whatsapp', 'instagram', 'manual']).optional(),
});

const updateCustomerSchema = createCustomerSchema.partial();

const listQuerySchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  source: z.enum(['website', 'whatsapp', 'instagram', 'manual']).optional(),
  sortBy: z.enum(['lastOrderAt', 'totalSpent', 'totalOrders', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export class CustomerController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCustomerSchema.parse(req.body);
      const customer = await customerService.create(req.user!.storeId!, data);

      res.status(201).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listQuerySchema.parse(req.query);
      const result = await customerService.list({
        storeId: req.user!.storeId!,
        ...query,
      });

      res.json({
        success: true,
        data: result.customers,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await customerService.getById(req.user!.storeId!, req.params.id);

      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }

  async getWithOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await customerService.getCustomerWithOrders(req.user!.storeId!, req.params.id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateCustomerSchema.parse(req.body);
      const customer = await customerService.update(req.user!.storeId!, req.params.id, data);

      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await customerService.delete(req.user!.storeId!, req.params.id);

      res.json({
        success: true,
        message: 'Customer deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();
