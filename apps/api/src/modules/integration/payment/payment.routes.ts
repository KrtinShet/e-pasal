import { Router } from 'express';

import { authenticate, requireStore } from '../../../middleware/auth.js';

import { paymentController } from './payment.controller.js';

export const paymentRouter = Router();

paymentRouter.post('/initiate', authenticate, requireStore, (req, res, next) =>
  paymentController.initiate(req, res, next)
);

paymentRouter.get('/callback/:provider', (req, res, next) =>
  paymentController.callback(req, res, next)
);

paymentRouter.post('/webhook/:provider', (req, res, next) =>
  paymentController.webhook(req, res, next)
);

paymentRouter.get(
  '/verify/:provider/:transactionId',
  authenticate,
  requireStore,
  (req, res, next) => paymentController.verify(req, res, next)
);

paymentRouter.post(
  '/refund/:provider/:transactionId',
  authenticate,
  requireStore,
  (req, res, next) => paymentController.refund(req, res, next)
);
