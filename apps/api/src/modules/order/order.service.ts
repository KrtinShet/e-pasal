import { Order, IOrder } from './order.model.js';
import { Product } from '../product/product.model.js';
import { inventoryService } from '../inventory/inventory.service.js';
import { NotFoundError, AppError } from '../../lib/errors.js';

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
}

interface OrderQuery {
  storeId: string;
  status?: string;
  paymentStatus?: string;
  customerId?: string;
  page?: number;
  limit?: number;
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
      items.map(item => ({
        productId: item.productId.toString(),
        quantity: item.quantity,
      }))
    );

    const order = await Order.create({
      storeId,
      orderNumber,
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
    });

    return order;
  }

  async list(query: OrderQuery) {
    const { storeId, status, paymentStatus, customerId, page = 1, limit = 20 } = query;

    const filter: any = { storeId };

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (customerId) filter.customerId = customerId;

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

  async updateStatus(storeId: string, id: string, status: string) {
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
        order.items.map(item => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
        }))
      );
    }

    if (status === 'delivered') {
      await inventoryService.confirmStock(
        storeId,
        order.items.map(item => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
        }))
      );
    }

    order.status = status as IOrder['status'];

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

    await order.save();

    return order;
  }

  async updatePaymentStatus(
    storeId: string,
    id: string,
    paymentStatus: string,
    transactionId?: string
  ) {
    const order = await this.getById(storeId, id);

    order.paymentStatus = paymentStatus as IOrder['paymentStatus'];

    if (paymentStatus === 'paid') {
      order.paymentDetails = {
        ...order.paymentDetails,
        transactionId,
        paidAt: new Date(),
      };
    }

    await order.save();

    return order;
  }

  private async resolveOrderItems(storeId: string, items: CreateOrderInput['items']) {
    const productIds = items.map(item => item.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      storeId,
    }).lean();

    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    return items.map(item => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new NotFoundError(`Product ${item.productId}`);
      }

      return {
        productId: product._id,
        variantId: item.variantId ? new (require('mongoose').Types.ObjectId)(item.variantId) : undefined,
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
    const count = await Order.countDocuments({ storeId });
    const prefix = 'ORD';
    const number = (count + 1).toString().padStart(6, '0');
    return `${prefix}-${number}`;
  }
}

export const orderService = new OrderService();
