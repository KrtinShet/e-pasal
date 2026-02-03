import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { isOnlinePayment, getPaymentProvider, type PaymentMethod } from './payment.factory.js';

const initiateSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
  paymentMethod: z.enum(['esewa', 'khalti', 'fonepay']),
  customerName: z.string(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  productName: z.string().optional(),
  successUrl: z.string().url(),
  failureUrl: z.string().url(),
});

const callbackQuerySchema = z.object({
  oid: z.string().optional(),
  amt: z.string().optional(),
  refId: z.string().optional(),
  pidx: z.string().optional(),
  transaction_id: z.string().optional(),
  status: z.string().optional(),
});

export class PaymentController {
  async initiate(req: Request, res: Response, next: NextFunction) {
    try {
      const data = initiateSchema.parse(req.body);

      if (!isOnlinePayment(data.paymentMethod as PaymentMethod)) {
        return res.status(400).json({
          success: false,
          error: 'Payment method does not support online payment',
        });
      }

      const provider = getPaymentProvider(data.paymentMethod as PaymentMethod);
      if (!provider) {
        return res.status(400).json({
          success: false,
          error: 'Payment provider not available',
        });
      }

      const result = await provider.initiate({
        orderId: data.orderId,
        amount: data.amount,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        productName: data.productName,
        successUrl: data.successUrl,
        failureUrl: data.failureUrl,
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
        });
      }

      res.json({
        success: true,
        data: {
          paymentUrl: result.paymentUrl,
          transactionId: result.transactionId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async callback(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider: providerName } = req.params;
      const query = callbackQuerySchema.parse(req.query);

      const provider = getPaymentProvider(providerName as PaymentMethod);
      if (!provider) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment provider',
        });
      }

      const transactionId = query.refId || query.pidx || query.transaction_id || '';
      if (!transactionId) {
        return res.status(400).json({
          success: false,
          error: 'Missing transaction ID',
        });
      }

      const result = await provider.verify(transactionId);

      // TODO: Update order payment status in database
      // await orderService.updatePaymentStatus(query.oid, result.verified ? 'paid' : 'failed');

      res.json({
        success: true,
        data: {
          verified: result.verified,
          transactionId: result.transactionId,
          status: result.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider: providerName } = req.params;

      const provider = getPaymentProvider(providerName as PaymentMethod);
      if (!provider) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment provider',
        });
      }

      // TODO: Implement webhook verification and processing
      // 1. Verify webhook signature
      // 2. Parse webhook payload
      // 3. Update order status based on event type
      // 4. Return acknowledgment

      res.json({
        success: true,
        message: 'Webhook received',
      });
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider: providerName, transactionId } = req.params;

      const provider = getPaymentProvider(providerName as PaymentMethod);
      if (!provider) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment provider',
        });
      }

      const result = await provider.verify(transactionId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refund(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider: providerName, transactionId } = req.params;
      const { amount } = req.body;

      const provider = getPaymentProvider(providerName as PaymentMethod);
      if (!provider) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment provider',
        });
      }

      const result = await provider.refund(transactionId, amount);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
