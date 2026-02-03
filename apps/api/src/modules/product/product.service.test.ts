import { it, vi, expect, describe, beforeEach } from 'vitest';

vi.mock('./product.model.js', () => ({
  Product: {
    findOne: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

import { ConflictError } from '../../lib/errors.js';

import { Product } from './product.model.js';
import { productService } from './product.service.js';

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates product with generated slug and store scope', async () => {
    vi.mocked(Product.findOne).mockResolvedValue(null as never);
    vi.mocked(Product.create).mockResolvedValue({
      _id: 'product-1',
      storeId: 'store-1',
      name: 'Fresh Apple',
      slug: 'fresh-apple',
    } as never);

    const result = await productService.create('store-1', {
      name: 'Fresh Apple',
      price: 100,
      stock: 10,
    } as never);

    expect(Product.findOne).toHaveBeenCalledWith({
      storeId: 'store-1',
      slug: 'fresh-apple',
    });
    expect(Product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        storeId: 'store-1',
        slug: 'fresh-apple',
      })
    );
    expect(result).toEqual(expect.objectContaining({ slug: 'fresh-apple' }));
  });

  it('rejects duplicate product name within same store', async () => {
    vi.mocked(Product.findOne).mockResolvedValue({ _id: 'existing-product' } as never);

    await expect(
      productService.create('store-1', {
        name: 'Fresh Apple',
        price: 100,
      } as never)
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('lists products using store filter and pagination', async () => {
    const products = [{ _id: 'p-1' }, { _id: 'p-2' }];

    const queryChain = {
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue(products as never),
    };

    vi.mocked(Product.find).mockReturnValue(queryChain as never);
    vi.mocked(Product.countDocuments).mockResolvedValue(2 as never);

    const result = await productService.list({
      storeId: 'store-1',
      page: 1,
      limit: 20,
    });

    expect(Product.find).toHaveBeenCalledWith({ storeId: 'store-1' });
    expect(result.products).toHaveLength(2);
    expect(result.pagination.total).toBe(2);
  });
});
