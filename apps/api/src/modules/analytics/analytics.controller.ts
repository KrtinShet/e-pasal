import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { analyticsService } from './analytics.service.js';

const revenueQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

const topProductsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
});

export class AnalyticsController {
  async dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await analyticsService.getDashboardStats(req.user!.storeId!);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async revenue(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = revenueQuerySchema.parse(req.query);
      const data = await analyticsService.getRevenueByPeriod(
        req.user!.storeId!,
        startDate,
        endDate
      );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async topProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit } = topProductsQuerySchema.parse(req.query);
      const data = await analyticsService.getTopProducts(req.user!.storeId!, limit);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async ordersByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getOrdersByStatus(req.user!.storeId!);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async recentOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getRecentOrders(req.user!.storeId!);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async ordersBySource(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getOrdersBySource(req.user!.storeId!);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async averageOrderValue(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getAverageOrderValue(req.user!.storeId!);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
