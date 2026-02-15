import { Store } from '../store/store.model.js';
import { Product } from '../product/product.model.js';
import { emailService } from '../email/email.service.js';
import { AppError, NotFoundError } from '../../lib/errors.js';
import type { OrderEmailData } from '../email/email.service.js';
import { inventoryService } from '../inventory/inventory.service.js';

import { Order } from './order.model.js';
import type { IOrder } from './order.model.js';

interface CreateOrderInput {
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  shipping: IOrder['shipping'];
  paymentMethod: IOrder['paymentMethod'];
  source?: IOrder['source'];
  notes?: string;
  customerId?: string;
}

interface OrderQuery {
  storeId: string;
  status?: string;
  paymentStatus?: string;
  customerId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: string;
  source?: string;
  page?: number;
  limit?: number;
}

interface UpdateFulfillmentInput {
  provider?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
};

export class OrderService {
  async create(storeId: string, input: CreateOrderInput) {
    const items = await this.resolveOrderItems(storeId, input.items);
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    const orderNumber = await this.generateOrderNumber(storeId);

    await inventoryService.reserveStock(
      storeId,
      items.map((item) => ({
        productId: item.productId.toString(),
        quantity: item.quantity,
      }))
    );

    try {
      const order = await Order.create({
        storeId,
        orderNumber,
        customerId: input.customerId,
        items,
        subtotal,
        discount: 0,
        shippingCost: 0,
        tax: 0,
        total: subtotal,
        shipping: input.shipping,
        paymentMethod: input.paymentMethod,
        source: input.source || 'website',
        notes: input.notes,
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(),
            note: 'Order placed',
          },
        ],
      });

      this.buildEmailData(order).then((data) => {
        if (data) emailService.sendOrderConfirmation(data);
      });

      return order;
    } catch (error) {
      await inventoryService.releaseStock(
        storeId,
        items.map((item) => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
        }))
      );
      throw error;
    }
  }

  async list(query: OrderQuery) {
    const {
      storeId,
      status,
      paymentStatus,
      customerId,
      search,
      dateFrom,
      dateTo,
      paymentMethod,
      source,
      page = 1,
      limit = 20,
    } = query;

    const filter: any = { storeId };

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (customerId) filter.customerId = customerId;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (source) filter.source = source;

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shipping.name': { $regex: search, $options: 'i' } },
        { 'shipping.phone': { $regex: search, $options: 'i' } },
        { 'shipping.email': { $regex: search, $options: 'i' } },
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(storeId: string, id: string) {
    const order = await Order.findOne({ _id: id, storeId });
    if (!order) {
      throw new NotFoundError('Order');
    }
    return order;
  }

  async getByOrderNumber(storeId: string, orderNumber: string) {
    const order = await Order.findOne({ storeId, orderNumber });
    if (!order) {
      throw new NotFoundError('Order');
    }
    return order;
  }

  async updateStatus(
    storeId: string,
    id: string,
    status: string,
    options?: { note?: string; cancelReason?: string; changedBy?: string }
  ) {
    const order = await this.getById(storeId, id);

    const allowedTransitions = STATUS_TRANSITIONS[order.status];
    if (!allowedTransitions.includes(status)) {
      throw new AppError(
        `Cannot transition from ${order.status} to ${status}`,
        400,
        'INVALID_STATUS_TRANSITION'
      );
    }

    if (status === 'cancelled') {
      await inventoryService.releaseStock(
        storeId,
        order.items.map((item) => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
        }))
      );
    }

    if (status === 'delivered') {
      await inventoryService.confirmStock(
        storeId,
        order.items.map((item) => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
        }))
      );
    }

    order.status = status as IOrder['status'];

    if (status === 'cancelled' && options?.cancelReason) {
      order.cancelReason = options.cancelReason;
    }

    if (status === 'shipped') {
      order.fulfillment = {
        ...order.fulfillment,
        shippedAt: new Date(),
      };
    }

    if (status === 'delivered') {
      order.fulfillment = {
        ...order.fulfillment,
        deliveredAt: new Date(),
      };
    }

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: options?.note || `Status changed to ${status}`,
      changedBy: options?.changedBy
        ? new (require('mongoose').Types.ObjectId)(options.changedBy)
        : undefined,
    });

    await order.save();

    if (status === 'shipped') {
      this.buildEmailData(order).then((data) => {
        if (data) emailService.sendShippingUpdate(data);
      });
    } else if (status === 'delivered') {
      this.buildEmailData(order).then((data) => {
        if (data) emailService.sendDeliveryConfirmation(data);
      });
    }

    return order;
  }

  async updatePaymentStatus(
    storeId: string,
    id: string,
    paymentStatus: string,
    options?: { transactionId?: string; note?: string; changedBy?: string }
  ) {
    const order = await this.getById(storeId, id);

    order.paymentStatus = paymentStatus as IOrder['paymentStatus'];

    if (paymentStatus === 'paid') {
      order.paymentDetails = {
        ...order.paymentDetails,
        transactionId: options?.transactionId,
        paidAt: new Date(),
      };
    }

    if (paymentStatus === 'refunded') {
      order.paymentDetails = {
        ...order.paymentDetails,
        refundedAt: new Date(),
      };
    }

    order.statusHistory.push({
      status: `payment_${paymentStatus}`,
      timestamp: new Date(),
      note: options?.note || `Payment status changed to ${paymentStatus}`,
      changedBy: options?.changedBy
        ? new (require('mongoose').Types.ObjectId)(options.changedBy)
        : undefined,
    });

    await order.save();

    if (paymentStatus === 'paid') {
      this.buildEmailData(order).then((data) => {
        if (data) emailService.sendPaymentReceived(data);
      });
    }

    return order;
  }

  async updateFulfillment(
    storeId: string,
    id: string,
    input: UpdateFulfillmentInput,
    changedBy?: string
  ) {
    const order = await this.getById(storeId, id);

    order.fulfillment = {
      ...order.fulfillment,
      ...input,
    };

    order.statusHistory.push({
      status: 'fulfillment_updated',
      timestamp: new Date(),
      note: input.trackingNumber
        ? `Tracking number updated: ${input.trackingNumber}`
        : 'Fulfillment details updated',
      changedBy: changedBy ? new (require('mongoose').Types.ObjectId)(changedBy) : undefined,
    });

    await order.save();

    return order;
  }

  async addNote(storeId: string, id: string, note: string, changedBy?: string) {
    const order = await this.getById(storeId, id);

    order.statusHistory.push({
      status: 'note',
      timestamp: new Date(),
      note,
      changedBy: changedBy ? new (require('mongoose').Types.ObjectId)(changedBy) : undefined,
    });

    await order.save();

    return order;
  }

  private async buildEmailData(order: IOrder): Promise<OrderEmailData | null> {
    if (!order.shipping?.email) return null;

    const store = await Store.findById(order.storeId).select('name').lean();

    return {
      orderNumber: order.orderNumber,
      customerName: order.shipping.name,
      customerEmail: order.shipping.email,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      shippingAddress: `${order.shipping.address}, ${order.shipping.city}`,
      trackingNumber: order.fulfillment?.trackingNumber,
      trackingUrl: order.fulfillment?.trackingUrl,
      storeName: store?.name || 'Store',
    };
  }

  private async resolveOrderItems(storeId: string, items: CreateOrderInput['items']) {
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      storeId,
    }).lean();

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    return items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new NotFoundError(`Product ${item.productId}`);
      }

      return {
        productId: product._id,
        variantId: item.variantId
          ? new (require('mongoose').Types.ObjectId)(item.variantId)
          : undefined,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
        image: product.images[0],
      };
    });
  }

  private async generateOrderNumber(storeId: string): Promise<string> {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}

export const orderService = new OrderService();
