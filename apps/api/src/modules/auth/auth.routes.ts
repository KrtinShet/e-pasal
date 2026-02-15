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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new merchant account
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201: { description: Account created }
 *       400: { description: Validation error }
 *       409: { description: Email already exists }
 *
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful, returns JWT tokens }
 *       401: { description: Invalid credentials }
 *
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: New token pair }
 *       401: { description: Invalid refresh token }
 *
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset email
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: Reset email sent if account exists }
 *
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token: { type: string }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       200: { description: Password updated }
 *       400: { description: Invalid or expired token }
 *
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     responses:
 *       200: { description: User profile }
 *       401: { description: Not authenticated }
 *
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and invalidate refresh token
 *     responses:
 *       200: { description: Logged out }
 */
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
