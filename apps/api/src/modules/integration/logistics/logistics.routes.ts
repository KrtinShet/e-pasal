import { Router } from 'express';

import { authenticate, requireStore } from '../../../middleware/auth.js';

import { logisticsController } from './logistics.controller.js';

export const logisticsRouter = Router();

logisticsRouter.get('/providers', authenticate, requireStore, (req, res, next) =>
  logisticsController.getProviders(req, res, next)
);

logisticsRouter.post('/rates', authenticate, requireStore, (req, res, next) =>
  logisticsController.calculateRate(req, res, next)
);

logisticsRouter.post('/shipments', authenticate, requireStore, (req, res, next) =>
  logisticsController.createShipment(req, res, next)
);

logisticsRouter.get('/shipments', authenticate, requireStore, (req, res, next) =>
  logisticsController.listShipments(req, res, next)
);

logisticsRouter.get('/tracking/:trackingId', authenticate, requireStore, (req, res, next) =>
  logisticsController.getTracking(req, res, next)
);

logisticsRouter.post('/shipments/:id/cancel', authenticate, requireStore, (req, res, next) =>
  logisticsController.cancelShipment(req, res, next)
);

logisticsRouter.post('/shipments/:id/cod-collected', authenticate, requireStore, (req, res, next) =>
  logisticsController.markCodCollected(req, res, next)
);

logisticsRouter.get('/cod-summary', authenticate, requireStore, (req, res, next) =>
  logisticsController.getCodSummary(req, res, next)
);

logisticsRouter.post('/webhooks/:provider', (req, res, next) =>
  logisticsController.webhook(req, res, next)
);
