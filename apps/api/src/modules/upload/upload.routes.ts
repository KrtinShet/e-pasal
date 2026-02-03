import { Router } from 'express';

import { authenticate } from '../../middleware/auth.js';

import { uploadController } from './upload.controller.js';
import { uploadMiddleware } from './upload.middleware.js';

export const uploadRouter = Router();

uploadRouter.post('/images', authenticate, uploadMiddleware.single('image'), (req, res, next) =>
  uploadController.uploadImage(req, res, next)
);
