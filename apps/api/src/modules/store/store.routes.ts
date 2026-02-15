import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { authenticate, requireStore } from '../../middleware/auth.js';

import { storeController } from './store.controller.js';

const aiGenerateRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many AI generation requests. Please try again later.',
    },
  },
});

export const storeRouter = Router();

/**
 * @swagger
 * /stores/check/{subdomain}:
 *   get:
 *     tags: [Stores]
 *     summary: Check subdomain availability
 *     security: []
 *     parameters:
 *       - in: path
 *         name: subdomain
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Availability result }
 *
 * /stores/me:
 *   get:
 *     tags: [Stores]
 *     summary: Get current merchant store
 *     responses:
 *       200: { description: Store details }
 *   patch:
 *     tags: [Stores]
 *     summary: Update store details
 *     responses:
 *       200: { description: Store updated }
 *
 * /stores/me/settings:
 *   patch:
 *     tags: [Stores]
 *     summary: Update store settings
 *     responses:
 *       200: { description: Settings updated }
 *
 * /stores/me/theme:
 *   get:
 *     tags: [Stores]
 *     summary: Get store theme
 *     responses:
 *       200: { description: Theme config }
 *   put:
 *     tags: [Stores]
 *     summary: Update store theme
 *     responses:
 *       200: { description: Theme updated }
 *
 * /stores/me/landing-page/draft:
 *   get:
 *     tags: [Stores]
 *     summary: Get landing page draft
 *     responses:
 *       200: { description: Draft content }
 *   put:
 *     tags: [Stores]
 *     summary: Save landing page draft
 *     responses:
 *       200: { description: Draft saved }
 *
 * /stores/me/landing-page/publish:
 *   post:
 *     tags: [Stores]
 *     summary: Publish landing page
 *     responses:
 *       200: { description: Page published }
 *
 * /stores/me/landing-page/generate:
 *   post:
 *     tags: [Stores]
 *     summary: AI-generate landing page content
 *     responses:
 *       200: { description: Generated content }
 *       429: { description: Rate limited }
 */
storeRouter.get('/check/:subdomain', (req, res, next) =>
  storeController.checkSubdomain(req, res, next)
);

storeRouter.use(authenticate, requireStore);

storeRouter.get('/me', (req, res, next) => storeController.getMyStore(req, res, next));
storeRouter.patch('/me', (req, res, next) => storeController.updateMyStore(req, res, next));
storeRouter.patch('/me/settings', (req, res, next) =>
  storeController.updateSettings(req, res, next)
);

storeRouter.get('/me/theme', (req, res, next) => storeController.getTheme(req, res, next));
storeRouter.put('/me/theme', (req, res, next) => storeController.updateTheme(req, res, next));
storeRouter.post('/me/theme/reset', (req, res, next) => storeController.resetTheme(req, res, next));
storeRouter.post('/me/theme/preset/:name', (req, res, next) =>
  storeController.applyPreset(req, res, next)
);

storeRouter.get('/me/landing-page/draft', (req, res, next) =>
  storeController.getLandingPageDraft(req, res, next)
);
storeRouter.put('/me/landing-page/draft', (req, res, next) =>
  storeController.saveLandingPageDraft(req, res, next)
);
storeRouter.post('/me/landing-page/publish', (req, res, next) =>
  storeController.publishLandingPage(req, res, next)
);
storeRouter.delete('/me/landing-page/published/:pageId', (req, res, next) =>
  storeController.unpublishLandingPage(req, res, next)
);
storeRouter.post('/me/landing-page/generate', aiGenerateRateLimit, (req, res, next) =>
  storeController.generateLandingPage(req, res, next)
);
