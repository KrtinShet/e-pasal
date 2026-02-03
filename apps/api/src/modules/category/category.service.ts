import { Product } from '../product/product.model.js';
import { ConflictError, NotFoundError } from '../../lib/errors.js';

import { Category } from './category.model.js';
import type { ICategory } from './category.model.js';

interface CategoryListQuery {
  storeId: string;
  status?: 'active' | 'inactive';
  search?: string;
  page?: number;
  limit?: number;
}

export class CategoryService {
  async create(storeId: string, data: Partial<ICategory>) {
    const slug = this.generateSlug(data.name ?? '');

    const existing = await Category.findOne({ storeId, slug });
    if (existing) {
      throw new ConflictError('Category with this name already exists');
    }

    return Category.create({
      ...data,
      storeId,
      slug,
    });
  }

  async list(query: CategoryListQuery) {
    const { storeId, status, search, page = 1, limit = 20 } = query;
    const filter: Record<string, unknown> = { storeId };

    if (status) filter.status = status;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const [categories, total] = await Promise.all([
      Category.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Category.countDocuments(filter),
    ]);

    return {
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(storeId: string, id: string) {
    const category = await Category.findOne({ _id: id, storeId });
    if (!category) {
      throw new NotFoundError('Category');
    }

    return category;
  }

  async update(storeId: string, id: string, data: Partial<ICategory>) {
    const updateData = { ...data };

    if (data.name) {
      updateData.slug = this.generateSlug(data.name);

      const existing = await Category.findOne({
        storeId,
        slug: updateData.slug,
        _id: { $ne: id },
      });

      if (existing) {
        throw new ConflictError('Category with this name already exists');
      }
    }

    const category = await Category.findOneAndUpdate(
      { _id: id, storeId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new NotFoundError('Category');
    }

    return category;
  }

  async delete(storeId: string, id: string) {
    const productCount = await Product.countDocuments({ storeId, categoryId: id });
    if (productCount > 0) {
      throw new ConflictError('Cannot delete category linked to existing products');
    }

    const category = await Category.findOneAndDelete({ _id: id, storeId });
    if (!category) {
      throw new NotFoundError('Category');
    }
  }

  private generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export const categoryService = new CategoryService();
