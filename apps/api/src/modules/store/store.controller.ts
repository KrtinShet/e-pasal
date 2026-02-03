import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { storeService } from './store.service.js';

const updateStoreSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  contact: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  social: z
    .object({
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional(),
      tiktok: z.string().url().optional(),
    })
    .optional(),
});

const updateSettingsSchema = z.object({
  currency: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  theme: z
    .object({
      primaryColor: z.string().optional(),
      accentColor: z.string().optional(),
    })
    .optional(),
});

export class StoreController {
  async getMyStore(req: Request, res: Response, next: NextFunction) {
    try {
      const store = await storeService.getById(req.user!.storeId!);

      res.json({
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMyStore(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateStoreSchema.parse(req.body);
      const store = await storeService.update(req.user!.storeId!, data);

      res.json({
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = updateSettingsSchema.parse(req.body);
      const store = await storeService.updateSettings(req.user!.storeId!, settings);

      res.json({
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkSubdomain(req: Request, res: Response, next: NextFunction) {
    try {
      const { subdomain } = req.params;
      const available = await storeService.checkSubdomainAvailability(subdomain);

      res.json({
        success: true,
        data: { available },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const storeController = new StoreController();
