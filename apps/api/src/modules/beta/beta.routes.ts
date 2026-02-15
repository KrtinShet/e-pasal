import { Router } from 'express';

import { authenticate, requireStore } from '../../middleware/auth.js';

import { betaController } from './beta.controller.js';

export const betaRouter = Router();

// Admin: manage beta invites
betaRouter.post('/invites', authenticate, (req, res, next) =>
  betaController.createInvite(req, res, next)
);
betaRouter.get('/invites', authenticate, (req, res, next) =>
  betaController.listInvites(req, res, next)
);

// Merchant: accept invite
betaRouter.post('/invites/accept', authenticate, (req, res, next) =>
  betaController.acceptInvite(req, res, next)
);

// Merchant: submit feedback
betaRouter.post('/feedback', authenticate, requireStore, (req, res, next) =>
  betaController.createFeedback(req, res, next)
);

// Admin: list and triage feedback
betaRouter.get('/feedback', authenticate, (req, res, next) =>
  betaController.listFeedback(req, res, next)
);
betaRouter.patch('/feedback/:id/triage', authenticate, (req, res, next) =>
  betaController.triageFeedback(req, res, next)
);
betaRouter.get('/feedback/stats', authenticate, (req, res, next) =>
  betaController.feedbackStats(req, res, next)
);

// Merchant: onboarding checklist
betaRouter.get('/onboarding-checklist', authenticate, requireStore, (req, res, next) =>
  betaController.onboardingChecklist(req, res, next)
);
