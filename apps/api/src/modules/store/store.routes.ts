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
storeRouter.post('/me/landing-page/generate', aiGenerateRateLimit, (req, res, next) =>
  storeController.generateLandingPage(req, res, next)
);
