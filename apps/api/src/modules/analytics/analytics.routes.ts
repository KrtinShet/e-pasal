import { Router } from 'express';

import { authenticate, requireStore } from '../../middleware/auth.js';

import { analyticsController } from './analytics.controller.js';

export const analyticsRouter = Router();

analyticsRouter.use(authenticate, requireStore);

analyticsRouter.get('/dashboard', (req, res, next) =>
  analyticsController.dashboard(req, res, next)
);
analyticsRouter.get('/revenue', (req, res, next) => analyticsController.revenue(req, res, next));
analyticsRouter.get('/top-products', (req, res, next) =>
  analyticsController.topProducts(req, res, next)
);
analyticsRouter.get('/orders-by-status', (req, res, next) =>
  analyticsController.ordersByStatus(req, res, next)
);
