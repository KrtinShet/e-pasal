import { it, vi, expect, describe, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { Order, inventoryService, orderService } from './test-setup.js';

describe('OrderService - status updates', () => {
  const storeId = 'store-123';
  const productId = new mongoose.Types.ObjectId();
  const orderId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateStatus', () => {
    it('updates order status and adds status history entry', async () => {
      const mockOrder = {
        _id: orderId,
        storeId,
        status: 'pending',
        items: [{ productId, quantity: 2 }],
        statusHistory: [{ status: 'pending', timestamp: new Date(), note: 'Order placed' }],
        save: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      await orderService.updateStatus(storeId, orderId.toString(), 'confirmed', {
        note: 'Order confirmed by merchant',
      });

      expect(mockOrder.status).toBe('confirmed');
      expect(mockOrder.statusHistory).toHaveLength(2);
      expect(mockOrder.statusHistory[1]).toEqual(
        expect.objectContaining({
          status: 'confirmed',
          note: 'Order confirmed by merchant',
        })
      );
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('throws error for invalid status transition', async () => {
      const mockOrder = {
        _id: orderId,
        storeId,
        status: 'pending',
        items: [],
        statusHistory: [],
        save: vi.fn(),
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      await expect(
        orderService.updateStatus(storeId, orderId.toString(), 'delivered')
      ).rejects.toThrow('Cannot transition from pending to delivered');
    });

    it('releases stock when order is cancelled', async () => {
      const mockOrder = {
        _id: orderId,
        storeId,
        status: 'pending',
        items: [{ productId, quantity: 2 }],
        statusHistory: [],
        save: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(inventoryService.releaseStock).mockResolvedValue(undefined as never);

      await orderService.updateStatus(storeId, orderId.toString(), 'cancelled', {
        cancelReason: 'Customer request',
      });

      expect(inventoryService.releaseStock).toHaveBeenCalledWith(storeId, [
        { productId: productId.toString(), quantity: 2 },
      ]);
      expect(mockOrder.status).toBe('cancelled');
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('confirms stock when order is delivered', async () => {
      const mockOrder = {
        _id: orderId,
        storeId,
        status: 'shipped',
        items: [{ productId, quantity: 2 }],
        statusHistory: [],
        fulfillment: {},
        save: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(inventoryService.confirmStock).mockResolvedValue(undefined as never);

      await orderService.updateStatus(storeId, orderId.toString(), 'delivered');

      expect(inventoryService.confirmStock).toHaveBeenCalledWith(storeId, [
        { productId: productId.toString(), quantity: 2 },
      ]);
      expect(mockOrder.status).toBe('delivered');
      expect(mockOrder.fulfillment.deliveredAt).toBeInstanceOf(Date);
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('sets shippedAt timestamp when order is shipped', async () => {
      const mockOrder = {
        _id: orderId,
        storeId,
        status: 'ready_for_pickup',
        items: [],
        statusHistory: [],
        fulfillment: {},
        save: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      await orderService.updateStatus(storeId, orderId.toString(), 'shipped');

      expect(mockOrder.status).toBe('shipped');
      expect(mockOrder.fulfillment.shippedAt).toBeInstanceOf(Date);
      expect(mockOrder.save).toHaveBeenCalled();
    });
  });
});
