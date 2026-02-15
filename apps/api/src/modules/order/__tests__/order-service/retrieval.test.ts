import mongoose from 'mongoose';
import { it, vi, expect, describe, beforeEach } from 'vitest';

import { NotFoundError } from '../../../../lib/errors.js';

import { Order, orderService } from './test-setup.js';

describe('OrderService - retrieval', () => {
  const storeId = 'store-123';
  const orderId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('returns order for valid id and storeId', async () => {
      const mockOrder = {
        _id: orderId,
        storeId,
        orderNumber: 'ORD-123',
        status: 'pending',
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const result = await orderService.getById(storeId, orderId.toString());

      expect(Order.findOne).toHaveBeenCalledWith({ _id: orderId.toString(), storeId });
      expect(result).toEqual(mockOrder);
    });

    it('throws NotFoundError if order does not exist', async () => {
      vi.mocked(Order.findOne).mockResolvedValue(null as never);

      await expect(orderService.getById(storeId, orderId.toString())).rejects.toBeInstanceOf(
        NotFoundError
      );
    });

    it('throws NotFoundError if order belongs to different store', async () => {
      vi.mocked(Order.findOne).mockResolvedValue(null as never);

      await expect(orderService.getById('different-store', orderId.toString())).rejects.toThrow(
        'Order not found'
      );
    });
  });

  describe('getByOrderNumber', () => {
    it('returns order for valid order number and storeId', async () => {
      const mockOrder = {
        _id: orderId,
        storeId,
        orderNumber: 'ORD-123',
        status: 'pending',
      };

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const result = await orderService.getByOrderNumber(storeId, 'ORD-123');

      expect(Order.findOne).toHaveBeenCalledWith({ storeId, orderNumber: 'ORD-123' });
      expect(result).toEqual(mockOrder);
    });

    it('throws NotFoundError if order number does not exist', async () => {
      vi.mocked(Order.findOne).mockResolvedValue(null as never);

      await expect(orderService.getByOrderNumber(storeId, 'NONEXISTENT')).rejects.toBeInstanceOf(
        NotFoundError
      );
    });
  });
});
