import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { orderService } from '../../order/order.service.js';

import { PaymentTransaction } from './payment-transaction.model.js';
import { isOnlinePayment, getPaymentProvider, type PaymentMethod } from './payment.factory.js';

const initiateSchema = z.object({
  orderId: z.string(),
  storeId: z.string(),
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
  data: z.string().optional(),
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
        return res.status(400).json({ success: false, error: result.error });
      }

      const idempotencyKey = `${data.orderId}:${data.paymentMethod}:${Date.now()}`;
      await PaymentTransaction.create({
        storeId: data.storeId,
        orderId: data.orderId,
        provider: data.paymentMethod,
        transactionId: result.transactionId || idempotencyKey,
        idempotencyKey,
        amount: data.amount,
        status: 'initiated',
        initiatedAt: new Date(),
        statusHistory: [{ status: 'initiated', timestamp: new Date() }],
      });

      return res.json({
        success: true,
        data: {
          paymentUrl: result.paymentUrl,
          transactionId: result.transactionId,
          formData: (result as Record<string, unknown>).formData,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async callback(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider: providerName } = req.params;
      const query = callbackQuerySchema.parse(req.query);

      const provider = getPaymentProvider(providerName as PaymentMethod);
      if (!provider) {
        return res.status(400).json({ success: false, error: 'Invalid payment provider' });
      }

      if (providerName === 'esewa' && query.data) {
        const webhookResult = await provider.handleWebhook?.(query.data);
        if (!webhookResult?.verified) {
          return res.status(400).json({ success: false, error: 'Signature verification failed' });
        }

        const txn = await PaymentTransaction.findOneAndUpdate(
          { transactionId: { $regex: webhookResult.orderId } },
          {
            status: webhookResult.status === 'paid' ? 'completed' : 'failed',
            completedAt: webhookResult.status === 'paid' ? new Date() : undefined,
            failedAt: webhookResult.status === 'failed' ? new Date() : undefined,
            $push: {
              statusHistory: {
                status: webhookResult.status,
                timestamp: new Date(),
                raw: webhookResult,
              },
            },
          },
          { new: true }
        );

        if (txn) {
          const paymentStatus = webhookResult.status === 'paid' ? 'paid' : 'failed';
          await orderService.updatePaymentStatus(
            txn.storeId.toString(),
            txn.orderId.toString(),
            paymentStatus,
            {
              transactionId: webhookResult.transactionId,
              note: `Payment ${paymentStatus} via ${providerName}`,
            }
          );
        }

        return res.json({
          success: true,
          data: {
            verified: true,
            transactionId: webhookResult.transactionId,
            status: webhookResult.status,
            orderId: webhookResult.orderId,
          },
        });
      }

      const transactionId = query.refId || query.pidx || query.transaction_id || '';
      if (!transactionId) {
        return res.status(400).json({ success: false, error: 'Missing transaction ID' });
      }

      const result = await provider.verify(transactionId);

      return res.json({
        success: true,
        data: {
          verified: result.verified,
          transactionId: result.transactionId,
          status: result.status,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider: providerName } = req.params;

      const provider = getPaymentProvider(providerName as PaymentMethod);
      if (!provider) {
        return res.status(400).json({ success: false, error: 'Invalid payment provider' });
      }

      if (!provider.handleWebhook) {
        return res.status(400).json({ success: false, error: 'Webhooks not supported' });
      }

      const signature = req.headers['x-esewa-signature'] as string | undefined;
      const result = await provider.handleWebhook(req.body, signature);

      if (!result.verified) {
        return res.status(400).json({ success: false, error: 'Webhook signature invalid' });
      }

      const existing = await PaymentTransaction.findOne({
        transactionId: result.transactionId,
        status: { $in: ['completed', 'refunded'] },
      });

      if (existing) {
        return res.json({ success: true, message: 'Already processed' });
      }

      const statusMap: Record<string, string> = {
        paid: 'completed',
        failed: 'failed',
        refunded: 'refunded',
      };

      const dateField: Record<string, string> = {
        paid: 'completedAt',
        failed: 'failedAt',
        refunded: 'refundedAt',
      };

      const txn = await PaymentTransaction.findOneAndUpdate(
        { transactionId: { $regex: result.orderId } },
        {
          status: statusMap[result.status],
          [dateField[result.status]]: new Date(),
          providerResponse: req.body,
          $push: {
            statusHistory: {
              status: result.status,
              timestamp: new Date(),
              raw: req.body,
            },
          },
        },
        { new: true }
      );

      if (txn) {
        const paymentStatus =
          result.status === 'paid' ? 'paid' : result.status === 'refunded' ? 'refunded' : 'failed';
        await orderService.updatePaymentStatus(
          txn.storeId.toString(),
          txn.orderId.toString(),
          paymentStatus,
          {
            transactionId: result.transactionId,
            note: `Payment ${paymentStatus} via ${providerName} webhook`,
          }
        );
      }

      console.info(
        `[webhook:${providerName}] processed: order=${result.orderId} status=${result.status} tx=${result.transactionId}`
      );

      return res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
      console.error(`[webhook] error:`, error);
      return next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider: providerName, transactionId } = req.params;
      const amount = req.query.amount ? Number(req.query.amount) : undefined;

      const provider = getPaymentProvider(providerName as PaymentMethod);
      if (!provider) {
        return res.status(400).json({ success: false, error: 'Invalid payment provider' });
      }

      const result = await provider.verify(transactionId, amount);

      return res.json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }

  async refund(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider: providerName, transactionId } = req.params;
      const { amount } = req.body;

      const provider = getPaymentProvider(providerName as PaymentMethod);
      if (!provider) {
        return res.status(400).json({ success: false, error: 'Invalid payment provider' });
      }

      const result = await provider.refund(transactionId, amount);

      return res.json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }
}

export const paymentController = new PaymentController();
