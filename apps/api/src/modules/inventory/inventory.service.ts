import { Inventory } from './inventory.model.js';
import { Product } from '../product/product.model.js';
import { AppError, NotFoundError } from '../../lib/errors.js';

interface StockItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export class InventoryService {
  async getByProduct(storeId: string, productId: string) {
    const inventory = await Inventory.findOne({ storeId, productId });
    if (!inventory) {
      throw new NotFoundError('Inventory');
    }
    return inventory;
  }

  async setStock(storeId: string, productId: string, quantity: number) {
    const inventory = await Inventory.findOneAndUpdate(
      { storeId, productId },
      {
        $set: { available: quantity },
        $setOnInsert: { storeId, productId },
      },
      { new: true, upsert: true }
    );

    await Product.findByIdAndUpdate(productId, { stock: quantity });

    return inventory;
  }

  async adjustStock(storeId: string, productId: string, adjustment: number) {
    const inventory = await Inventory.findOneAndUpdate(
      { storeId, productId, available: { $gte: adjustment < 0 ? -adjustment : 0 } },
      { $inc: { available: adjustment } },
      { new: true }
    );

    if (!inventory) {
      throw new AppError('Insufficient stock', 400, 'INSUFFICIENT_STOCK');
    }

    await Product.findByIdAndUpdate(productId, { $inc: { stock: adjustment } });

    return inventory;
  }

  async reserveStock(storeId: string, items: StockItem[]) {
    for (const item of items) {
      const inventory = await Inventory.findOneAndUpdate(
        {
          storeId,
          productId: item.productId,
          available: { $gte: item.quantity },
        },
        {
          $inc: {
            available: -item.quantity,
            reserved: item.quantity,
          },
        },
        { new: true }
      );

      if (!inventory) {
        throw new AppError(
          `Insufficient stock for product ${item.productId}`,
          400,
          'INSUFFICIENT_STOCK'
        );
      }
    }
  }

  async releaseStock(storeId: string, items: StockItem[]) {
    for (const item of items) {
      await Inventory.findOneAndUpdate(
        { storeId, productId: item.productId },
        {
          $inc: {
            available: item.quantity,
            reserved: -item.quantity,
          },
        }
      );
    }
  }

  async confirmStock(storeId: string, items: StockItem[]) {
    for (const item of items) {
      await Inventory.findOneAndUpdate(
        { storeId, productId: item.productId },
        {
          $inc: {
            reserved: -item.quantity,
            committed: item.quantity,
          },
        }
      );

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }
  }

  async getLowStock(storeId: string) {
    const lowStock = await Inventory.aggregate([
      { $match: { storeId } },
      {
        $match: {
          $expr: { $lte: ['$available', '$lowStockThreshold'] },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: 1,
          productName: '$product.name',
          available: 1,
          reserved: 1,
          lowStockThreshold: 1,
        },
      },
    ]);

    return lowStock;
  }

  async syncInventoryFromProducts(storeId: string) {
    const products = await Product.find({ storeId }).lean();

    for (const product of products) {
      await Inventory.findOneAndUpdate(
        { storeId, productId: product._id },
        {
          $setOnInsert: {
            storeId,
            productId: product._id,
            sku: product.sku,
            available: product.stock,
          },
        },
        { upsert: true }
      );
    }
  }
}

export const inventoryService = new InventoryService();
