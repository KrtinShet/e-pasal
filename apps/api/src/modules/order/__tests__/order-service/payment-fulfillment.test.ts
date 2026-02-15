import mongoose from 'mongoose';
import { it, vi, expect, describe, beforeEach } from 'vitest';

import { Order, orderService } from './test-setup.js';

describe('OrderService - payment and fulfillment', () => {
  const storeId = 'store-123';
  const orderId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updatePaymentStatus', () => {
    it('updates payment status and adds history entry', async () => {
      const mockOrder = {
        _id: orderId,
        storeId,
        paymentStatus: 'pending',
        paymentDetails: {},
        statusHistory: [],
        save: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      await orderService.updatePaymentStatus(storeId, orderId.toString(), 'paid', {
        transactionId: 'TXN-123',
        note: 'Payment received',
      });

      expect(mockOrder.paymentStatus).toBe('paid');
      expect(mockOrder.paymentDetails.transactionId).toBe('TXN-123');
      expect(mockOrder.paymentDetails.paidAt).toBeInstanceOf(Date);
      expect(mockOrder.statusHistory[0]).toEqual(
        expect.objectContaining({
          status: 'payment_paid',
          note: 'Payment received',
        })
      );
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('sets refundedAt when payment is refunded', async () => {
      const mockOrder = {
        _id: orderId,
        storeId,
        paymentStatus: 'paid',
        paymentDetails: {},
        statusHistory: [],
        save: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      await orderService.updatePaymentStatus(storeId, orderId.toString(), 'refunded');

      expect(mockOrder.paymentStatus).toBe('refunded');
      expect(mockOrder.paymentDetails.refundedAt).toBeInstanceOf(Date);
      expect(mockOrder.save).toHaveBeenCalled();
    });
  });

  describe('updateFulfillment', () => {
    it('updates fulfillment details and adds history entry', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockOrder = {
        _id: orderId,
        storeId,
        fulfillment: {},
        statusHistory: [],
        save: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      await orderService.updateFulfillment(
        storeId,
        orderId.toString(),
        {
          provider: 'DHL',
          trackingNumber: 'TRACK-123',
          trackingUrl: 'https://dhl.com/track/TRACK-123',
        },
        userId.toString()
      );

      expect(mockOrder.fulfillment.provider).toBe('DHL');
      expect(mockOrder.fulfillment.trackingNumber).toBe('TRACK-123');
      expect(mockOrder.fulfillment.trackingUrl).toBe('https://dhl.com/track/TRACK-123');
      expect(mockOrder.statusHistory[0]).toEqual(
        expect.objectContaining({
          status: 'fulfillment_updated',
          note: 'Tracking number updated: TRACK-123',
        })
      );
      expect(mockOrder.save).toHaveBeenCalled();
    });
  });

  describe('addNote', () => {
    it('adds note to status history', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockOrder = {
        _id: orderId,
        storeId,
        statusHistory: [],
        save: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      await orderService.addNote(
        storeId,
        orderId.toString(),
        'Customer called to confirm',
        userId.toString()
      );

      expect(mockOrder.statusHistory).toHaveLength(1);
      expect(mockOrder.statusHistory[0]).toEqual(
        expect.objectContaining({
          status: 'note',
          note: 'Customer called to confirm',
        })
      );
      expect(mockOrder.save).toHaveBeenCalled();
    });
  });
});
