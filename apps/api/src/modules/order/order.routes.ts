import { Router } from 'express';

import { authenticate, requireStore } from '../../middleware/auth.js';

import { orderController } from './order.controller.js';

export const orderRouter = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     responses:
 *       201: { description: Order created }
 *   get:
 *     tags: [Orders]
 *     summary: List orders for the current store
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, confirmed, processing, shipped, delivered, cancelled] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Order list }
 *
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order details }
 *       404: { description: Not found }
 *
 * /orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Status updated }
 *
 * /orders/{id}/fulfillment:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order fulfillment info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Fulfillment updated }
 *
 * /orders/{id}/payment-status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order payment status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Payment status updated }
 *
 * /orders/{id}/notes:
 *   patch:
 *     tags: [Orders]
 *     summary: Add note to an order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Note added }
 */
orderRouter.use(authenticate, requireStore);

orderRouter.post('/', (req, res, next) => orderController.create(req, res, next));
orderRouter.get('/', (req, res, next) => orderController.list(req, res, next));
orderRouter.get('/:id', (req, res, next) => orderController.getById(req, res, next));
orderRouter.patch('/:id/status', (req, res, next) => orderController.updateStatus(req, res, next));
orderRouter.patch('/:id/fulfillment', (req, res, next) =>
  orderController.updateFulfillment(req, res, next)
);
orderRouter.patch('/:id/payment-status', (req, res, next) =>
  orderController.updatePaymentStatus(req, res, next)
);
orderRouter.patch('/:id/notes', (req, res, next) => orderController.addNote(req, res, next));
