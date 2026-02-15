import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { Store } from '../../store/store.model.js';

import { encrypt, decrypt, maskSecret } from './encryption.util.js';

const paymentConfigSchema = z.object({
  provider: z.enum(['esewa', 'khalti', 'fonepay']),
  enabled: z.boolean(),
  testMode: z.boolean().optional().default(false),
  credentials: z
    .object({
      merchantCode: z.string().optional(),
      secretKey: z.string().optional(),
      publicKey: z.string().optional(),
    })
    .optional(),
});

const logisticsConfigSchema = z.object({
  provider: z.enum(['pathao', 'ncm', 'dash']),
  enabled: z.boolean(),
  credentials: z
    .object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      username: z.string().optional(),
      password: z.string().optional(),
    })
    .optional(),
  defaultPickupAddress: z
    .object({
      address: z.string(),
      city: z.string(),
      zone: z.string().optional(),
      area: z.string().optional(),
      phone: z.string(),
    })
    .optional(),
});

function encryptCredentials(creds: Record<string, string | undefined>): Record<string, string> {
  const encrypted: Record<string, string> = {};
  for (const [key, value] of Object.entries(creds)) {
    if (value) encrypted[key] = encrypt(value);
  }
  return encrypted;
}

function maskCredentials(creds: Record<string, string | undefined>): Record<string, string> {
  const masked: Record<string, string> = {};
  for (const [key, value] of Object.entries(creds)) {
    if (value) {
      try {
        masked[key] = maskSecret(decrypt(value));
      } catch {
        masked[key] = '****';
      }
    }
  }
  return masked;
}

export class IntegrationSettingsController {
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const store = await Store.findById(req.user!.storeId);
      if (!store) {
        return res.status(404).json({ success: false, error: 'Store not found' });
      }

      const integrations = store.integrations as Record<string, unknown>;
      const payments = ((integrations?.payments as unknown[]) || []).map((p: unknown) => {
        const config = p as Record<string, unknown>;
        return {
          ...config,
          credentials: config.credentials
            ? maskCredentials(config.credentials as Record<string, string>)
            : {},
        };
      });

      const logistics = ((integrations?.logistics as unknown[]) || []).map((l: unknown) => {
        const config = l as Record<string, unknown>;
        return {
          ...config,
          credentials: config.credentials
            ? maskCredentials(config.credentials as Record<string, string>)
            : {},
        };
      });

      return res.json({
        success: true,
        data: { payments, logistics },
      });
    } catch (error) {
      return next(error);
    }
  }

  async updatePaymentConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const data = paymentConfigSchema.parse(req.body);
      const store = await Store.findById(req.user!.storeId);
      if (!store) {
        return res.status(404).json({ success: false, error: 'Store not found' });
      }

      const integrations = store.integrations as Record<string, unknown[]>;
      let payments = (integrations?.payments as Record<string, unknown>[]) || [];

      if (!Array.isArray(payments) || typeof payments[0] === 'string') {
        payments = [];
      }

      const existing = payments.findIndex(
        (p) => (p as Record<string, unknown>).provider === data.provider
      );

      const config: Record<string, unknown> = {
        provider: data.provider,
        enabled: data.enabled,
        testMode: data.testMode,
        connectedAt: new Date(),
      };

      if (data.credentials) {
        config.credentials = encryptCredentials(data.credentials);
      } else if (existing >= 0) {
        config.credentials = (payments[existing] as Record<string, unknown>).credentials;
      }

      if (existing >= 0) {
        payments[existing] = config;
      } else {
        payments.push(config);
      }

      store.set('integrations.payments', payments);
      await store.save();

      return res.json({
        success: true,
        data: {
          ...config,
          credentials: config.credentials
            ? maskCredentials(config.credentials as Record<string, string>)
            : {},
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateLogisticsConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const data = logisticsConfigSchema.parse(req.body);
      const store = await Store.findById(req.user!.storeId);
      if (!store) {
        return res.status(404).json({ success: false, error: 'Store not found' });
      }

      const integrations = store.integrations as Record<string, unknown[]>;
      let logistics = (integrations?.logistics as Record<string, unknown>[]) || [];

      if (!Array.isArray(logistics) || typeof logistics[0] === 'string') {
        logistics = [];
      }

      const existing = logistics.findIndex(
        (l) => (l as Record<string, unknown>).provider === data.provider
      );

      const config: Record<string, unknown> = {
        provider: data.provider,
        enabled: data.enabled,
        defaultPickupAddress: data.defaultPickupAddress,
        connectedAt: new Date(),
      };

      if (data.credentials) {
        config.credentials = encryptCredentials(data.credentials);
      } else if (existing >= 0) {
        config.credentials = (logistics[existing] as Record<string, unknown>).credentials;
      }

      if (existing >= 0) {
        logistics[existing] = config;
      } else {
        logistics.push(config);
      }

      store.set('integrations.logistics', logistics);
      await store.save();

      return res.json({
        success: true,
        data: {
          ...config,
          credentials: config.credentials
            ? maskCredentials(config.credentials as Record<string, string>)
            : {},
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async getEnabledPaymentMethods(req: Request, res: Response, next: NextFunction) {
    try {
      const store = await Store.findById(req.user!.storeId);
      if (!store) {
        return res.status(404).json({ success: false, error: 'Store not found' });
      }

      const integrations = store.integrations as Record<string, unknown[]>;
      const payments = (integrations?.payments as Record<string, unknown>[]) || [];

      const enabled = payments.filter((p) => p.enabled).map((p) => p.provider as string);

      enabled.push('cod');

      return res.json({ success: true, data: enabled });
    } catch (error) {
      return next(error);
    }
  }

  async testConnection(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, provider } = req.params;
      const store = await Store.findById(req.user!.storeId);
      if (!store) {
        return res.status(404).json({ success: false, error: 'Store not found' });
      }

      // TODO: Implement actual provider connection testing
      return res.json({
        success: true,
        data: { connected: true, provider, type },
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const integrationSettingsController = new IntegrationSettingsController();
