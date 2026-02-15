import mongoose from 'mongoose';
import { it, vi, expect, describe, beforeEach } from 'vitest';

import { NotFoundError } from '../../../../lib/errors.js';

import { Order, Product, orderService, inventoryService } from './test-setup.js';

describe('OrderService - create', () => {
  const storeId = 'store-123';
  const productId = new mongoose.Types.ObjectId();
  const orderId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
