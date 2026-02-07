import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { env } from '../../config/env.js';
import { getAIClient } from '../../lib/ai-client.js';
import { auditService } from '../audit/audit.service.js';

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

const updateThemeSchema = z.object({
  preset: z.string().optional(),
  tokens: z.record(z.unknown()).optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
});

const landingPageDraftSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  sections: z.array(
    z.object({
      id: z.string().min(1),
      type: z.string().min(1),
      props: z.record(z.unknown()),
      visible: z.boolean(),
    })
  ),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .optional()
    .default({}),
});

const generatePageSchema = z.object({
  businessType: z.string().min(1),
  tone: z.string().optional(),
  targetAudience: z.string().optional(),
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
      const oldStore = await storeService.getById(req.user!.storeId!);
      const store = await storeService.update(req.user!.storeId!, data);

      const changes: Record<string, { from: unknown; to: unknown }> = {};
      for (const key of Object.keys(data) as (keyof typeof data)[]) {
        const oldVal = oldStore[key as keyof typeof oldStore];
        changes[key] = { from: oldVal, to: data[key] };
      }

      auditService.log({
        storeId: req.user!.storeId!,
        userId: req.user!.id,
        action: 'store.update',
        resource: 'store',
        resourceId: req.user!.storeId!,
        details: { changes },
        ipAddress: req.ip,
      });

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
      const oldStore = await storeService.getById(req.user!.storeId!);
      const oldSettings = oldStore.settings;
      const store = await storeService.updateSettings(req.user!.storeId!, settings as any);

      const changes: Record<string, { from: unknown; to: unknown }> = {};
      for (const key of Object.keys(settings) as (keyof typeof settings)[]) {
        changes[key] = {
          from: oldSettings[key as keyof typeof oldSettings],
          to: settings[key],
        };
      }

      auditService.log({
        storeId: req.user!.storeId!,
        userId: req.user!.id,
        action: 'settings.update',
        resource: 'store_settings',
        resourceId: req.user!.storeId!,
        details: { changes },
        ipAddress: req.ip,
      });

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
  async getTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const theme = await storeService.getTheme(req.user!.storeId!);
      res.json({ success: true, data: theme });
    } catch (error) {
      next(error);
    }
  }

  async updateTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateThemeSchema.parse(req.body);
      const theme = await storeService.updateTheme(req.user!.storeId!, data);
      res.json({ success: true, data: theme });
    } catch (error) {
      next(error);
    }
  }

  async resetTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const theme = await storeService.resetTheme(req.user!.storeId!);
      res.json({ success: true, data: theme });
    } catch (error) {
      next(error);
    }
  }

  async applyPreset(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.params.name as string;
      const theme = await storeService.applyPreset(req.user!.storeId!, name);
      res.json({ success: true, data: theme });
    } catch (error) {
      next(error);
    }
  }

  async getLandingPageDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const draft = await storeService.getLandingPageDraft(req.user!.storeId!);
      res.json({ success: true, data: draft });
    } catch (error) {
      next(error);
    }
  }

  async saveLandingPageDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const config = landingPageDraftSchema.parse(req.body);
      const draft = await storeService.saveLandingPageDraft(
        req.user!.storeId!,
        config as unknown as Record<string, unknown>
      );
      res.json({ success: true, data: draft });
    } catch (error) {
      next(error);
    }
  }

  async publishLandingPage(req: Request, res: Response, next: NextFunction) {
    try {
      const config = await storeService.publishLandingPage(req.user!.storeId!);
      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }
  async generateLandingPage(req: Request, res: Response, next: NextFunction) {
    try {
      if (env.AI_PROVIDER === 'none') {
        res.status(503).json({
          success: false,
          error: { code: 'AI_NOT_CONFIGURED', message: 'AI generation is not configured' },
        });
        return;
      }

      const input = generatePageSchema.parse(req.body);
      const store = await storeService.getById(req.user!.storeId!);

      const { generatePageWithAI } = await import('@baazarify/storefront-builder');
      const client = getAIClient();

      const pageConfig = await generatePageWithAI(client, {
        businessType: input.businessType,
        tone: input.tone,
        targetAudience: input.targetAudience,
        storeName: store.name,
        storeDescription: store.description,
      });

      await storeService.saveLandingPageDraft(
        req.user!.storeId!,
        pageConfig as unknown as Record<string, unknown>
      );

      res.json({ success: true, data: pageConfig });
    } catch (error) {
      next(error);
    }
  }
}

export const storeController = new StoreController();
