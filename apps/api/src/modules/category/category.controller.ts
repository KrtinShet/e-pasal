import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { categoryService } from './category.service.js';

export const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().optional(),
  order: z.number().int().min(0).default(0),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const updateCategorySchema = createCategorySchema.partial();

export const listCategoryQuerySchema = z.object({
  status: z.enum(['active', 'inactive']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export class CategoryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.create(req.user!.storeId!, req.body);

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.list({
        storeId: req.user!.storeId!,
        ...(req.query as z.infer<typeof listCategoryQuerySchema>),
      });

      res.json({
        success: true,
        data: result.categories,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getById(req.user!.storeId!, req.params.id);

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.update(req.user!.storeId!, req.params.id, req.body);

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(req.user!.storeId!, req.params.id);

      res.json({
        success: true,
        message: 'Category deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
