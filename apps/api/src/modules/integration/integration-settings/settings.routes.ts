import { Router } from 'express';

import { authenticate, requireStore } from '../../../middleware/auth.js';

import { integrationSettingsController } from './settings.controller.js';

export const integrationSettingsRouter = Router();

integrationSettingsRouter.use(authenticate, requireStore);

integrationSettingsRouter.get('/', (req, res, next) =>
  integrationSettingsController.getSettings(req, res, next)
);

integrationSettingsRouter.put('/payments', (req, res, next) =>
  integrationSettingsController.updatePaymentConfig(req, res, next)
);

integrationSettingsRouter.put('/logistics', (req, res, next) =>
  integrationSettingsController.updateLogisticsConfig(req, res, next)
);

integrationSettingsRouter.get('/payment-methods', (req, res, next) =>
  integrationSettingsController.getEnabledPaymentMethods(req, res, next)
);

integrationSettingsRouter.post('/test/:type/:provider', (req, res, next) =>
  integrationSettingsController.testConnection(req, res, next)
);
