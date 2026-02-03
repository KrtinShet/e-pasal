import { Router } from 'express';

import { authenticate, requireStore } from '../../middleware/auth.js';

import { productController } from './product.controller.js';

export const productRouter = Router();

productRouter.use(authenticate, requireStore);

productRouter.post('/', (req, res, next) => productController.create(req, res, next));
productRouter.get('/', (req, res, next) => productController.list(req, res, next));
productRouter.get('/:id', (req, res, next) => productController.getById(req, res, next));
productRouter.patch('/:id', (req, res, next) => productController.update(req, res, next));
productRouter.delete('/:id', (req, res, next) => productController.delete(req, res, next));
