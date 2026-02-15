import { it, vi, expect, describe, beforeEach } from 'vitest';

import { Order, orderService } from './test-setup.js';

describe('OrderService - list', () => {
  const storeId = 'store-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
