import { NotFoundError, ConflictError } from '../../lib/errors.js';

import { Product } from './product.model.js';
import type { IProduct } from './product.model.js';

interface ProductQuery {
  storeId: string;
  status?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class ProductService {
  async create(storeId: string, data: Partial<IProduct>) {
    const slug = this.generateSlug(data.name!);

    const existing = await Product.findOne({ storeId, slug });
    if (existing) {
      throw new ConflictError('Product with this name already exists');
    }

    const product = await Product.create({
      ...data,
      storeId,
      slug,
    });

    return product;
  }

  async list(query: ProductQuery) {
    const { storeId, status, categoryId, search, page = 1, limit = 20 } = query;

    const filter: any = { storeId };

    if (status) filter.status = status;
    if (categoryId) filter.categoryId = categoryId;
    if (search) {
      filter.$text = { $search: search };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(storeId: string, id: string) {
    const product = await Product.findOne({ _id: id, storeId });
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  }

  async getBySlug(storeId: string, slug: string) {
    const product = await Product.findOne({ storeId, slug });
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  }

  async update(storeId: string, id: string, data: Partial<IProduct>) {
    if (data.name) {
      data.slug = this.generateSlug(data.name);

      const existing = await Product.findOne({
        storeId,
        slug: data.slug,
        _id: { $ne: id },
      });

      if (existing) {
        throw new ConflictError('Product with this name already exists');
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, storeId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new NotFoundError('Product');
    }

    return product;
  }

  async delete(storeId: string, id: string) {
    const product = await Product.findOneAndDelete({ _id: id, storeId });
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  }

  async updateStock(storeId: string, id: string, quantity: number) {
    const product = await Product.findOneAndUpdate(
      { _id: id, storeId },
      { $inc: { stock: quantity } },
      { new: true }
    );

    if (!product) {
      throw new NotFoundError('Product');
    }

    return product;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export const productService = new ProductService();
