import { Router } from 'express';

import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { authRateLimit } from '../../middleware/rate-limit.js';

import { loginSchema, refreshSchema, authController, registerSchema } from './auth.controller.js';

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
authRouter.get('/me', authenticate, (req, res) => authController.me(req, res));
