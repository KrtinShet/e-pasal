import { Router } from 'express';
import { inventoryController } from './inventory.controller.js';
import { authenticate, requireStore } from '../../middleware/auth.js';

export const inventoryRouter = Router();

inventoryRouter.use(authenticate, requireStore);

inventoryRouter.get('/low-stock', (req, res, next) => inventoryController.getLowStock(req, res, next));
inventoryRouter.get('/products/:productId', (req, res, next) => inventoryController.getByProduct(req, res, next));
inventoryRouter.put('/products/:productId', (req, res, next) => inventoryController.setStock(req, res, next));
inventoryRouter.patch('/products/:productId', (req, res, next) => inventoryController.adjustStock(req, res, next));
