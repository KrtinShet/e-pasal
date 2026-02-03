import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { inventoryService } from './inventory.service.js';

const setStockSchema = z.object({
  quantity: z.number().min(0),
});

const adjustStockSchema = z.object({
  adjustment: z.number(),
});

export class InventoryController {
  async getByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const inventory = await inventoryService.getByProduct(
        req.user!.storeId!,
        req.params.productId
      );

      res.json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  async setStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { quantity } = setStockSchema.parse(req.body);
      const inventory = await inventoryService.setStock(
        req.user!.storeId!,
        req.params.productId,
        quantity
      );

      res.json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { adjustment } = adjustStockSchema.parse(req.body);
      const inventory = await inventoryService.adjustStock(
        req.user!.storeId!,
        req.params.productId,
        adjustment
      );

      res.json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const lowStock = await inventoryService.getLowStock(req.user!.storeId!);

      res.json({
        success: true,
        data: lowStock,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
