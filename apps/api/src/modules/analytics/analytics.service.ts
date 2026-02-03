import mongoose from 'mongoose';

import { Order } from '../order/order.model.js';
import { Product } from '../product/product.model.js';
import { Customer } from '../customer/customer.model.js';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrdersCount: number;
}

interface RevenueByPeriod {
  period: string;
  revenue: number;
  orderCount: number;
}

interface TopProduct {
  productId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  image?: string;
}

interface OrdersByStatus {
  status: string;
  count: number;
}

export class AnalyticsService {
  async getDashboardStats(storeId: string): Promise<DashboardStats> {
    const storeObjectId = new mongoose.Types.ObjectId(storeId);

    const [totalOrders, revenueResult, totalCustomers, totalProducts, recentOrdersCount] =
      await Promise.all([
        Order.countDocuments({ storeId: storeObjectId }),
        Order.aggregate([
          { $match: { storeId: storeObjectId, status: { $nin: ['cancelled', 'refunded'] } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        Customer.countDocuments({ storeId: storeObjectId }),
        Product.countDocuments({ storeId: storeObjectId }),
        Order.countDocuments({
          storeId: storeObjectId,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
      ]);

    return {
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      totalCustomers,
      totalProducts,
      recentOrdersCount,
    };
  }

  async getRevenueByPeriod(
    storeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<RevenueByPeriod[]> {
    const storeObjectId = new mongoose.Types.ObjectId(storeId);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    let dateFormat: string;
    let groupBy: any;

    if (daysDiff <= 31) {
      dateFormat = '%Y-%m-%d';
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
    } else if (daysDiff <= 90) {
      dateFormat = '%Y-W%V';
      groupBy = {
        year: { $isoWeekYear: '$createdAt' },
        week: { $isoWeek: '$createdAt' },
      };
    } else {
      dateFormat = '%Y-%m';
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      };
    }

    const result = await Order.aggregate([
      {
        $match: {
          storeId: storeObjectId,
          status: { $nin: ['cancelled', 'refunded'] },
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1, '_id.day': 1 },
      },
      {
        $project: {
          _id: 0,
          period: {
            $dateToString: {
              format: dateFormat,
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: { $ifNull: ['$_id.month', 1] },
                  day: { $ifNull: ['$_id.day', 1] },
                },
              },
            },
          },
          revenue: 1,
          orderCount: 1,
        },
      },
    ]);

    return result;
  }

  async getTopProducts(storeId: string, limit: number = 10): Promise<TopProduct[]> {
    const storeObjectId = new mongoose.Types.ObjectId(storeId);

    const result = await Order.aggregate([
      {
        $match: {
          storeId: storeObjectId,
          status: { $nin: ['cancelled', 'refunded'] },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          image: { $first: '$items.image' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          productId: { $toString: '$_id' },
          name: 1,
          image: 1,
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return result;
  }

  async getOrdersByStatus(storeId: string): Promise<OrdersByStatus[]> {
    const storeObjectId = new mongoose.Types.ObjectId(storeId);

    const result = await Order.aggregate([
      { $match: { storeId: storeObjectId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    return result;
  }
}

export const analyticsService = new AnalyticsService();
