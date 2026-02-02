import { Router } from 'express';
import { storeController } from './store.controller.js';
import { authenticate, requireStore } from '../../middleware/auth.js';

export const storeRouter = Router();

storeRouter.get('/check/:subdomain', (req, res, next) => storeController.checkSubdomain(req, res, next));

storeRouter.use(authenticate, requireStore);

storeRouter.get('/me', (req, res, next) => storeController.getMyStore(req, res, next));
storeRouter.patch('/me', (req, res, next) => storeController.updateMyStore(req, res, next));
storeRouter.patch('/me/settings', (req, res, next) => storeController.updateSettings(req, res, next));
