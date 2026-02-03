import { Router } from 'express';

import { authenticate, requireStore } from '../../middleware/auth.js';

import { orderController } from './order.controller.js';

export const orderRouter = Router();

orderRouter.use(authenticate, requireStore);

orderRouter.post('/', (req, res, next) => orderController.create(req, res, next));
orderRouter.get('/', (req, res, next) => orderController.list(req, res, next));
orderRouter.get('/:id', (req, res, next) => orderController.getById(req, res, next));
orderRouter.patch('/:id/status', (req, res, next) => orderController.updateStatus(req, res, next));
