import { it, vi, expect, describe, beforeEach } from 'vitest';

vi.mock('./category.model.js', () => ({
  Category: {
    findOne: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn(),
    findOneAndDelete: vi.fn(),
  },
}));

vi.mock('../product/product.model.js', () => ({
  Product: {
    countDocuments: vi.fn(),
  },
}));

import { ConflictError } from '../../lib/errors.js';
import { Product } from '../product/product.model.js';

import { Category } from './category.model.js';
import { categoryService } from './category.service.js';

describe('categoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates category with generated slug', async () => {
    vi.mocked(Category.findOne).mockResolvedValue(null as never);
    vi.mocked(Category.create).mockResolvedValue({ _id: 'cat-1', slug: 'home-decor' } as never);

    await categoryService.create('store-1', { name: 'Home Decor' } as never);

    expect(Category.findOne).toHaveBeenCalledWith({ storeId: 'store-1', slug: 'home-decor' });
    expect(Category.create).toHaveBeenCalledWith(
      expect.objectContaining({
        storeId: 'store-1',
        slug: 'home-decor',
      })
    );
  });

  it('blocks deleting category linked with products', async () => {
    vi.mocked(Product.countDocuments).mockResolvedValue(2 as never);

    await expect(categoryService.delete('store-1', 'cat-1')).rejects.toBeInstanceOf(ConflictError);
    expect(Category.findOneAndDelete).not.toHaveBeenCalled();
  });
});
