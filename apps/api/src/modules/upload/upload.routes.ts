import { Router } from 'express';
import { uploadController } from './upload.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { uploadMiddleware } from './upload.middleware.js';

export const uploadRouter = Router();

uploadRouter.post(
  '/images',
  authenticate,
  uploadMiddleware.single('image'),
  (req, res, next) => uploadController.uploadImage(req, res, next)
);
