import { it, vi, expect, describe, beforeEach } from 'vitest';

vi.mock('../order.model.js', () => ({
  Order: {
    create: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../../product/product.model.js', () => ({
  Product: {
    find: vi.fn(),
  },
}));

vi.mock('../../inventory/inventory.service.js', () => ({
  inventoryService: {
    reserveStock: vi.fn(),
    releaseStock: vi.fn(),
    confirmStock: vi.fn(),
  },
}));

import mongoose from 'mongoose';

import { AppError, NotFoundError } from '../../../lib/errors.js';
import { Product } from '../../product/product.model.js';
import { inventoryService } from '../../inventory/inventory.service.js';

import { Order } from '../order.model.js';
import { orderService } from '../order.service.js';

describe('OrderService', () => {
  const storeId = 'store-123';
  const productId = new mongoose.Types.ObjectId();
  const orderId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('creates order with valid items and reserves stock', async () => {
      const mockProduct = {
        _id: productId,
        name: 'Test Product',
        sku: 'TEST-001',
        price: 100,
        images: ['image1.jpg'],
      };

      const findMock = {
        lean: vi.fn().mockResolvedValue([mockProduct]),
      };
      vi.mocked(Product.find).mockReturnValue(findMock as never);
      vi.mocked(inventoryService.reserveStock).mockResolvedValue(undefined as never);
      vi.mocked(Order.create).mockResolvedValue({
        _id: orderId,
        storeId,
        orderNumber: 'ORD-123',
        items: [
          {
            productId,
            name: 'Test Product',
            sku: 'TEST-001',
            price: 100,
            quantity: 2,
            total: 200,
            image: 'image1.jpg',
          },
        ],
        subtotal: 200,
        total: 200,
        status: 'pending',
        statusHistory: [{ status: 'pending', timestamp: new Date(), note: 'Order placed' }],
      } as never);

      const input = {
        items: [{ productId: productId.toString(), quantity: 2 }],
        shipping: {
          name: 'John Doe',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Kathmandu',
          country: 'Nepal',
        },
        paymentMethod: 'cod' as const,
      };

      const result = await orderService.create(storeId, input);

      expect(Product.find).toHaveBeenCalledWith({
        _id: { $in: [productId.toString()] },
        storeId,
      });

      expect(inventoryService.reserveStock).toHaveBeenCalledWith(storeId, [
        { productId: productId.toString(), quantity: 2 },
      ]);

      expect(Order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          storeId,
          subtotal: 200,
          total: 200,
        })
      );

      const createCall = vi.mocked(Order.create).mock.calls[0][0];
      expect(createCall.items).toHaveLength(1);
      expect(createCall.items[0]).toMatchObject({
        productId,
        quantity: 2,
        total: 200,
      });
      expect(createCall.statusHistory[0].status).toBe('pending');

      expect(result.status).toBe('pending');
    });

    it('releases stock if order creation fails', async () => {
      const mockProduct = {
        _id: productId,
        name: 'Test Product',
        sku: 'TEST-001',
        price: 100,
        images: ['image1.jpg'],
      };

      const findMock = {
        lean: vi.fn().mockResolvedValue([mockProduct]),
      };
      vi.mocked(Product.find).mockReturnValue(findMock as never);
      vi.mocked(inventoryService.reserveStock).mockResolvedValue(undefined as never);
      vi.mocked(Order.create).mockRejectedValue(new Error('Database error'));

      const input = {
        items: [{ productId: productId.toString(), quantity: 2 }],
        shipping: {
          name: 'John Doe',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Kathmandu',
          country: 'Nepal',
        },
        paymentMethod: 'cod' as const,
      };

      await expect(orderService.create(storeId, input)).rejects.toThrow('Database error');

      expect(inventoryService.releaseStock).toHaveBeenCalledWith(storeId, [
        { productId: productId.toString(), quantity: 2 },
      ]);
    });

    it('throws NotFoundError if product does not exist', async () => {
      const findMock = {
        lean: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(Product.find).mockReturnValue(findMock as never);

      const input = {
        items: [{ productId: productId.toString(), quantity: 2 }],
        shipping: {
          name: 'John Doe',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Kathmandu',
          country: 'Nepal',
        },
        paymentMethod: 'cod' as const,
      };

      await expect(orderService.create(storeId, input)).rejects.toBeInstanceOf(NotFoundError);
    });

    it('creates order with multiple items and correct subtotal', async () => {
      const product1Id = new mongoose.Types.ObjectId();
      const product2Id = new mongoose.Types.ObjectId();

      const mockProducts = [
        {
          _id: product1Id,
          name: 'Product 1',
          sku: 'PROD-001',
          price: 50,
          images: ['img1.jpg'],
        },
        {
          _id: product2Id,
          name: 'Product 2',
          sku: 'PROD-002',
          price: 75,
          images: ['img2.jpg'],
        },
      ];

      const findMock = {
        lean: vi.fn().mockResolvedValue(mockProducts),
      };
      vi.mocked(Product.find).mockReturnValue(findMock as never);
      vi.mocked(inventoryService.reserveStock).mockResolvedValue(undefined as never);
      vi.mocked(Order.create).mockResolvedValue({
        _id: orderId,
        storeId,
        orderNumber: 'ORD-123',
        items: [
          { productId: product1Id, quantity: 2, total: 100 },
          { productId: product2Id, quantity: 1, total: 75 },
        ],
        subtotal: 175,
        total: 175,
        status: 'pending',
      } as never);

      const input = {
        items: [
          { productId: product1Id.toString(), quantity: 2 },
          { productId: product2Id.toString(), quantity: 1 },
        ],
        shipping: {
          name: 'John Doe',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Kathmandu',
          country: 'Nepal',
        },
        paymentMethod: 'esewa' as const,
      };

      const result = await orderService.create(storeId, input);

      expect(result.subtotal).toBe(175);
      expect(inventoryService.reserveStock).toHaveBeenCalledWith(storeId, [
        { productId: product1Id.toString(), quantity: 2 },
        { productId: product2Id.toString(), quantity: 1 },
      ]);
    });
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

      await expect(
        orderService.getByOrderNumber(storeId, 'NONEXISTENT')
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('list', () => {
    it('returns paginated orders for store', async () => {
      const mockOrders = [
        { _id: '1', orderNumber: 'ORD-001', status: 'pending' },
        { _id: '2', orderNumber: 'ORD-002', status: 'confirmed' },
      ];

      const findMock = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockOrders),
      };

      vi.mocked(Order.find).mockReturnValue(findMock as never);
      vi.mocked(Order.countDocuments).mockResolvedValue(2);

      const result = await orderService.list({ storeId, page: 1, limit: 20 });

      expect(Order.find).toHaveBeenCalledWith({ storeId });
      expect(result.orders).toEqual(mockOrders);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        pages: 1,
      });
    });

    it('filters orders by status', async () => {
      const findMock = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(Order.find).mockReturnValue(findMock as never);
      vi.mocked(Order.countDocuments).mockResolvedValue(0);

      await orderService.list({ storeId, status: 'confirmed' });

      expect(Order.find).toHaveBeenCalledWith({ storeId, status: 'confirmed' });
    });

    it('searches orders by order number and customer details', async () => {
      const findMock = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(Order.find).mockReturnValue(findMock as never);
      vi.mocked(Order.countDocuments).mockResolvedValue(0);

      await orderService.list({ storeId, search: 'john' });

      expect(Order.find).toHaveBeenCalledWith(
        expect.objectContaining({
          storeId,
          $or: expect.arrayContaining([
            { orderNumber: { $regex: 'john', $options: 'i' } },
            { 'shipping.name': { $regex: 'john', $options: 'i' } },
            { 'shipping.phone': { $regex: 'john', $options: 'i' } },
            { 'shipping.email': { $regex: 'john', $options: 'i' } },
          ]),
        })
      );
    });

    it('filters orders by date range', async () => {
      const findMock = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(Order.find).mockReturnValue(findMock as never);
      vi.mocked(Order.countDocuments).mockResolvedValue(0);

      const dateFrom = '2024-01-01';
      const dateTo = '2024-01-31';

      await orderService.list({ storeId, dateFrom, dateTo });

      expect(Order.find).toHaveBeenCalledWith(
        expect.objectContaining({
          storeId,
          createdAt: {
            $gte: new Date(dateFrom),
            $lte: new Date(dateTo),
          },
        })
      );
    });

    it('filters orders by payment method and source', async () => {
      const findMock = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(Order.find).mockReturnValue(findMock as never);
      vi.mocked(Order.countDocuments).mockResolvedValue(0);

      await orderService.list({ storeId, paymentMethod: 'esewa', source: 'website' });

      expect(Order.find).toHaveBeenCalledWith({
        storeId,
        paymentMethod: 'esewa',
        source: 'website',
      });
    });

    it('handles pagination correctly', async () => {
      const findMock = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(Order.find).mockReturnValue(findMock as never);
      vi.mocked(Order.countDocuments).mockResolvedValue(50);

      await orderService.list({ storeId, page: 2, limit: 10 });

      expect(findMock.skip).toHaveBeenCalledWith(10);
      expect(findMock.limit).toHaveBeenCalledWith(10);
    });
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

      await orderService.addNote(storeId, orderId.toString(), 'Customer called to confirm', userId.toString());

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

  describe('edge cases', () => {
    it('handles empty order items list gracefully', async () => {
      const findMock = {
        lean: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(Product.find).mockReturnValue(findMock as never);

      const input = {
        items: [],
        shipping: {
          name: 'John Doe',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Kathmandu',
          country: 'Nepal',
        },
        paymentMethod: 'cod' as const,
      };

      vi.mocked(Order.create).mockResolvedValue({
        _id: orderId,
        items: [],
        subtotal: 0,
        total: 0,
      } as never);

      const result = await orderService.create(storeId, input);

      expect(result.subtotal).toBe(0);
      expect(inventoryService.reserveStock).toHaveBeenCalledWith(storeId, []);
    });

    it('handles order with variant items', async () => {
      const variantId = new mongoose.Types.ObjectId();
      const mockProduct = {
        _id: productId,
        name: 'Variant Product',
        sku: 'VAR-001',
        price: 100,
        images: ['image1.jpg'],
      };

      const findMock = {
        lean: vi.fn().mockResolvedValue([mockProduct]),
      };
      vi.mocked(Product.find).mockReturnValue(findMock as never);
      vi.mocked(inventoryService.reserveStock).mockResolvedValue(undefined as never);
      vi.mocked(Order.create).mockResolvedValue({
        _id: orderId,
        items: [
          {
            productId,
            variantId,
            quantity: 1,
            total: 100,
          },
        ],
        subtotal: 100,
        total: 100,
      } as never);

      const input = {
        items: [{ productId: productId.toString(), variantId: variantId.toString(), quantity: 1 }],
        shipping: {
          name: 'John Doe',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Kathmandu',
          country: 'Nepal',
        },
        paymentMethod: 'cod' as const,
      };

      const result = await orderService.create(storeId, input);

      expect(Order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              variantId: expect.anything(),
            }),
          ]),
        })
      );
    });
  });
});
