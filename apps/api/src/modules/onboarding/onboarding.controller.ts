import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { onboardingService } from './onboarding.service.js';

export const completeOnboardingSchema = z.object({
  storeName: z.string().min(2).max(100),
  subdomain: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  contact: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  logo: z.string().url().optional(),
  theme: z
    .object({
      primaryColor: z.string().optional(),
      accentColor: z.string().optional(),
    })
    .optional(),
});

export class OnboardingController {
  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const input = completeOnboardingSchema.parse(req.body);
      const result = await onboardingService.complete(req.user!.id, input);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const onboardingController = new OnboardingController();
