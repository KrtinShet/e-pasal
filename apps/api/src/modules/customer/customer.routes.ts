import { Router } from 'express';

import { authenticate, requireStore } from '../../middleware/auth.js';

import { customerController } from './customer.controller.js';

export const customerRouter = Router();

customerRouter.use(authenticate, requireStore);

customerRouter.post('/', (req, res, next) => customerController.create(req, res, next));
customerRouter.get('/', (req, res, next) => customerController.list(req, res, next));
customerRouter.get('/:id', (req, res, next) => customerController.getById(req, res, next));
customerRouter.get('/:id/orders', (req, res, next) =>
  customerController.getWithOrders(req, res, next)
);
customerRouter.patch('/:id', (req, res, next) => customerController.update(req, res, next));
customerRouter.delete('/:id', (req, res, next) => customerController.delete(req, res, next));
