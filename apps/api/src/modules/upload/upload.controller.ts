import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { s3Provider } from './s3.provider.js';
import { AppError } from '../../lib/errors.js';

export class UploadController {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;

      if (!file) {
        throw new AppError('No file provided', 400, 'NO_FILE');
      }

      const ext = path.extname(file.originalname).toLowerCase();
      const filename = `${uuidv4()}${ext}`;
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
