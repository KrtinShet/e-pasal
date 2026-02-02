import { Router } from 'express';
import { notificationController } from './notification.controller.js';
import { authenticate, requireStore } from '../../middleware/auth.js';

export const notificationRouter = Router();

notificationRouter.use(authenticate, requireStore);

notificationRouter.get('/', (req, res, next) => notificationController.list(req, res, next));
notificationRouter.get('/unread-count', (req, res, next) => notificationController.getUnreadCount(req, res, next));
notificationRouter.patch('/read-all', (req, res, next) => notificationController.markAllAsRead(req, res, next));
notificationRouter.patch('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));
