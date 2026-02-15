import { Router } from 'express';

import { authenticate, requireStore } from '../../middleware/auth.js';

import { productController } from './product.controller.js';

export const productRouter = Router();

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     responses:
 *       201: { description: Product created }
 *   get:
 *     tags: [Products]
 *     summary: List products for the current store
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Product list }
 *
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product details }
 *       404: { description: Not found }
 *   patch:
 *     tags: [Products]
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product updated }
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product deleted }
 */
productRouter.use(authenticate, requireStore);

productRouter.post('/', (req, res, next) => productController.create(req, res, next));
productRouter.get('/', (req, res, next) => productController.list(req, res, next));
productRouter.get('/:id', (req, res, next) => productController.getById(req, res, next));
productRouter.patch('/:id', (req, res, next) => productController.update(req, res, next));
productRouter.delete('/:id', (req, res, next) => productController.delete(req, res, next));
