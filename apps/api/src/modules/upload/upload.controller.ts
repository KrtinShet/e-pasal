import path from 'path';
import { randomUUID } from 'node:crypto';

import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../../lib/errors.js';

import { s3Provider } from './s3.provider.js';

export class UploadController {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;

      if (!file) {
        throw new AppError('No file provided', 400, 'NO_FILE');
      }

      const ext = path.extname(file.originalname).toLowerCase();
      const filename = `${randomUUID()}${ext}`;
      const filePath = `images/${req.user!.storeId || req.user!.id}/${filename}`;

      const result = await s3Provider.upload(file.buffer, filePath, file.mimetype);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
