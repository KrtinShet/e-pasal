import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';
import { authenticate, requireStore } from '../../middleware/auth.js';

export const analyticsRouter = Router();

analyticsRouter.use(authenticate, requireStore);

analyticsRouter.get('/dashboard', (req, res, next) => analyticsController.dashboard(req, res, next));
analyticsRouter.get('/revenue', (req, res, next) => analyticsController.revenue(req, res, next));
analyticsRouter.get('/top-products', (req, res, next) => analyticsController.topProducts(req, res, next));
analyticsRouter.get('/orders-by-status', (req, res, next) => analyticsController.ordersByStatus(req, res, next));
