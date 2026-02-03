import { it, vi, expect, describe, beforeEach } from 'vitest';

vi.mock('./inventory.model.js', () => ({
  Inventory: {
    findOneAndUpdate: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('../product/product.model.js', () => ({
  Product: {
    findOneAndUpdate: vi.fn(),
  },
}));

import { AppError } from '../../lib/errors.js';
import { Product } from '../product/product.model.js';

import { Inventory } from './inventory.model.js';
import { inventoryService } from './inventory.service.js';

describe('inventoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets stock and enforces store-scoped product update', async () => {
    vi.mocked(Inventory.findOneAndUpdate).mockResolvedValue({
      productId: 'product-1',
      available: 7,
    } as never);
    vi.mocked(Product.findOneAndUpdate).mockResolvedValue({ _id: 'product-1' } as never);

    const result = await inventoryService.setStock('store-1', 'product-1', 7);

    expect(Inventory.findOneAndUpdate).toHaveBeenCalledWith(
      { storeId: 'store-1', productId: 'product-1' },
      expect.any(Object),
      { new: true, upsert: true }
    );
    expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'product-1', storeId: 'store-1' },
      { stock: 7 },
      { new: true }
    );
    expect(result).toEqual(expect.objectContaining({ available: 7 }));
  });

  it('blocks updates when stock adjustment would underflow', async () => {
    vi.mocked(Inventory.findOneAndUpdate).mockResolvedValue(null as never);

    await expect(inventoryService.adjustStock('store-1', 'product-1', -20)).rejects.toBeInstanceOf(
      AppError
    );

    expect(Product.findOneAndUpdate).not.toHaveBeenCalled();
  });
});
