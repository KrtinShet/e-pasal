import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { betaService } from './beta.service.js';

const createInviteSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  notes: z.string().optional(),
});

const acceptInviteSchema = z.object({
  code: z.string().min(1),
});

const createFeedbackSchema = z.object({
  type: z.enum(['bug', 'ux', 'feature', 'general']),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  screenshot: z.string().optional(),
});

const triageSchema = z.object({
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  status: z.enum(['open', 'triaged', 'in_progress', 'resolved', 'wontfix']).optional(),
  assignee: z.string().optional(),
  resolution: z.string().optional(),
});

export class BetaController {
  async createInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createInviteSchema.parse(req.body);
      const invite = await betaService.createInvite(data);
      res.status(201).json({ success: true, data: invite });
    } catch (error) {
      next(error);
    }
  }

  async listInvites(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const invites = await betaService.listInvites(status);
      res.json({ success: true, data: invites });
    } catch (error) {
      next(error);
    }
  }

  async acceptInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = acceptInviteSchema.parse(req.body);
      const invite = await betaService.acceptInvite(code, req.user!.id);
      res.json({ success: true, data: invite });
    } catch (error) {
      next(error);
    }
  }

  async createFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createFeedbackSchema.parse(req.body);
      const feedback = await betaService.createFeedback({
        ...data,
        storeId: req.user!.storeId!,
        userId: req.user!.id,
      });
      res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      next(error);
    }
  }

  async listFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, status, priority } = req.query as Record<string, string>;
      const feedback = await betaService.listFeedback({ type, status, priority });
      res.json({ success: true, data: feedback });
    } catch (error) {
      next(error);
    }
  }

  async triageFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const data = triageSchema.parse(req.body);
      const feedback = await betaService.triageFeedback(req.params.id as string, data);
      res.json({ success: true, data: feedback });
    } catch (error) {
      next(error);
    }
  }

  async onboardingChecklist(req: Request, res: Response, next: NextFunction) {
    try {
      const checklist = await betaService.getOnboardingChecklist(req.user!.storeId!);
      res.json({ success: true, data: checklist });
    } catch (error) {
      next(error);
    }
  }

  async feedbackStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await betaService.getFeedbackStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }
}

export const betaController = new BetaController();
