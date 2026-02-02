import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { productService } from './product.service.js';

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  categoryId: z.string().optional(),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock: z.number().min(0).default(0),
  trackInventory: z.boolean().default(true),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  tags: z.array(z.string()).optional(),
});

const updateProductSchema = createProductSchema.partial();

const listQuerySchema = z.object({
  status: z.enum(['draft', 'active', 'archived']).optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await productService.create(req.user!.storeId!, data);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listQuerySchema.parse(req.query);
      const result = await productService.list({
        storeId: req.user!.storeId!,
        ...query,
      });

      res.json({
        success: true,
        data: result.products,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(
        req.user!.storeId!,
        req.params.id
      );

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await productService.update(
        req.user!.storeId!,
        req.params.id,
        data
      );

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.delete(req.user!.storeId!, req.params.id);

      res.json({
        success: true,
        message: 'Product deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
