import { Order } from '../order/order.model.js';
import { NotFoundError, ConflictError } from '../../lib/errors.js';

import { Customer } from './customer.model.js';
import type { ICustomer } from './customer.model.js';

interface CustomerQuery {
  storeId: string;
  search?: string;
  tag?: string;
  source?: string;
  sortBy?: 'lastOrderAt' | 'totalSpent' | 'totalOrders' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class CustomerService {
  async create(storeId: string, data: Partial<ICustomer>) {
    const existing = await Customer.findOne({ storeId, phone: data.phone });
    if (existing) {
      throw new ConflictError('Customer with this phone already exists');
    }

    const customer = await Customer.create({
      ...data,
      storeId,
    });

    return customer;
  }

  async list(query: CustomerQuery) {
    const {
      storeId,
      search,
      tag,
      source,
      sortBy = 'lastOrderAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const filter: any = { storeId };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      filter.tags = tag;
    }

    if (source) {
      filter.source = source;
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    if (sortBy !== 'createdAt') {
      sort.createdAt = -1;
    }

    const [customers, total] = await Promise.all([
      Customer.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Customer.countDocuments(filter),
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(storeId: string, id: string) {
    const customer = await Customer.findOne({ _id: id, storeId });
    if (!customer) {
      throw new NotFoundError('Customer');
    }
    return customer;
  }

  async getByPhone(storeId: string, phone: string) {
    const customer = await Customer.findOne({ storeId, phone });
    return customer;
  }

  async getOrCreate(storeId: string, data: { name: string; phone: string; email?: string }) {
    let customer = await Customer.findOne({ storeId, phone: data.phone });

    if (!customer) {
      customer = await Customer.create({
        storeId,
        name: data.name,
        phone: data.phone,
        email: data.email,
      });
    }

    return customer;
  }

  async getCustomerWithOrders(storeId: string, customerId: string) {
    const customer = await Customer.findOne({ _id: customerId, storeId }).lean();
    if (!customer) {
      throw new NotFoundError('Customer');
    }

    const orders = await Order.find({ storeId, customerId })
      .sort({ createdAt: -1 })
      .select('orderNumber status total paymentStatus createdAt items')
      .lean();

    return { customer, orders };
  }

  async update(storeId: string, id: string, data: Partial<ICustomer>) {
    const customer = await Customer.findOneAndUpdate(
      { _id: id, storeId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!customer) {
      throw new NotFoundError('Customer');
    }

    return customer;
  }

  async incrementOrderStats(storeId: string, customerId: string, orderTotal: number) {
    await Customer.findOneAndUpdate(
      { _id: customerId, storeId },
      {
        $inc: { totalOrders: 1, totalSpent: orderTotal },
        $set: { lastOrderAt: new Date() },
      }
    );
  }

  async delete(storeId: string, id: string) {
    const customer = await Customer.findOneAndDelete({ _id: id, storeId });
    if (!customer) {
      throw new NotFoundError('Customer');
    }
    return customer;
  }
}

export const customerService = new CustomerService();
