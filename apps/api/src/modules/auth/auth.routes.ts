import { Router } from 'express';

import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { authRateLimit } from '../../middleware/rate-limit.js';

import {
  loginSchema,
  refreshSchema,
  registerSchema,
  authController,
  resetPasswordSchema,
  forgotPasswordSchema,
} from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', authRateLimit, validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);
authRouter.post('/login', authRateLimit, validate(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);
authRouter.post('/refresh', authRateLimit, validate(refreshSchema), (req, res, next) =>
  authController.refresh(req, res, next)
);
authRouter.post(
  '/forgot-password',
  authRateLimit,
  validate(forgotPasswordSchema),
  (req, res, next) => authController.forgotPassword(req, res, next)
);
authRouter.post('/reset-password', authRateLimit, validate(resetPasswordSchema), (req, res, next) =>
  authController.resetPassword(req, res, next)
);
authRouter.get('/me', authenticate, (req, res, next) => authController.me(req, res, next));
authRouter.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));
