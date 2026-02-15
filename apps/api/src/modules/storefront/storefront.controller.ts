import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import { env } from '../../config/env.js';
import { Store } from '../store/store.model.js';
import { NotFoundError } from '../../lib/errors.js';
import { Product } from '../product/product.model.js';
import { Category } from '../category/category.model.js';
import { orderService } from '../order/order.service.js';
import { storeService } from '../store/store.service.js';
import { customerService } from '../customer/customer.service.js';
import { isOnlinePayment, getPaymentProvider } from '../integration/payment/payment.factory.js';

const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc']).default('newest'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().min(1),
      })
    )
    .min(1),
  customer: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string(),
  }),
  shipping: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    notes: z.string().optional(),
  }),
  paymentMethod: z.enum(['cod', 'esewa', 'khalti', 'fonepay']),
});

export class StorefrontController {
  async getStore(req: Request, res: Response, next: NextFunction) {
    try {
      const { subdomain } = req.params;

      const store = await Store.findOne({
        subdomain,
        status: 'active',
      })
        .select('-integrations')
        .lean();

      if (!store) {
        throw new NotFoundError('Store');
      }

      res.json({
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  }

  async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { subdomain } = req.params;
      const query = listProductsQuerySchema.parse(req.query);

      const store = await Store.findOne({ subdomain, status: 'active' }).lean();
      if (!store) {
        throw new NotFoundError('Store');
      }

      const filter: any = {
        storeId: store._id,
        status: 'active',
        visibility: 'visible',
      };

      if (query.category) {
        filter.categoryId = query.category;
      }

      if (query.search) {
        filter.$text = { $search: query.search };
      }

      let sortOption: any = { createdAt: -1 };
      if (query.sort === 'price_asc') sortOption = { price: 1 };
      if (query.sort === 'price_desc') sortOption = { price: -1 };

      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort(sortOption)
          .skip((query.page - 1) * query.limit)
          .limit(query.limit)
          .select('name slug images price compareAtPrice stock')
          .lean(),
        Product.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: products,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          pages: Math.ceil(total / query.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { subdomain, slug } = req.params;

      const store = await Store.findOne({ subdomain, status: 'active' }).lean();
      if (!store) {
        throw new NotFoundError('Store');
      }

      const product = await Product.findOne({
        storeId: store._id,
        slug,
        status: 'active',
        visibility: 'visible',
      }).lean();

      if (!product) {
        throw new NotFoundError('Product');
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async listCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { subdomain } = req.params;

      const store = await Store.findOne({ subdomain, status: 'active' }).lean();
      if (!store) {
        throw new NotFoundError('Store');
      }

      const categories = await Category.find({
        storeId: store._id,
        status: 'active',
      })
        .sort({ order: 1 })
        .lean();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const { subdomain } = req.params;
      const data = checkoutSchema.parse(req.body);

      const store = await Store.findOne({ subdomain, status: 'active' }).lean();
      if (!store) {
        throw new NotFoundError('Store');
      }

      const customer = await customerService.getOrCreate(store._id.toString(), {
        name: data.customer.name,
        phone: data.customer.phone,
        email: data.customer.email,
      });

      const order = await orderService.create(store._id.toString(), {
        items: data.items,
        shipping: {
          name: data.customer.name,
          phone: data.customer.phone,
          email: data.customer.email,
          address: data.shipping.address,
          city: data.shipping.city,
          state: data.shipping.state,
          postalCode: data.shipping.postalCode,
          country: 'Nepal',
          notes: data.shipping.notes,
        },
        paymentMethod: data.paymentMethod,
        source: 'website',
      });

      await customerService.incrementOrderStats(
        store._id.toString(),
        customer._id.toString(),
        order.total
      );

      if (isOnlinePayment(data.paymentMethod)) {
        const provider = getPaymentProvider(data.paymentMethod);
        if (provider) {
          const callbackBase = `${env.WEBHOOK_BASE_URL}/api/v1/integrations/payment/callback/${data.paymentMethod}`;
          const result = await provider.initiate({
            orderId: order._id.toString(),
            amount: order.total,
            customerName: data.customer.name,
            customerEmail: data.customer.email,
            customerPhone: data.customer.phone,
            successUrl: callbackBase,
            failureUrl: callbackBase,
          });

          if (result.success) {
            return res.status(201).json({
              success: true,
              data: {
                orderId: order._id,
                orderNumber: order.orderNumber,
                total: order.total,
                paymentMethod: order.paymentMethod,
                paymentUrl: result.paymentUrl,
                transactionId: result.transactionId,
                formData: (result as Record<string, unknown>).formData,
              },
            });
          }
        }
      }

      res.status(201).json({
        success: true,
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          paymentMethod: order.paymentMethod,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async trackOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { subdomain, orderNumber } = req.params;

      const store = await Store.findOne({ subdomain, status: 'active' }).lean();
      if (!store) {
        throw new NotFoundError('Store');
      }

      const order = await orderService.getByOrderNumber(store._id.toString(), orderNumber);

      res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          total: order.total,
          items: order.items,
          fulfillment: order.fulfillment,
          createdAt: order.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const subdomain = req.params.subdomain as string;
      const theme = await storeService.getPublicTheme(subdomain);
      res.json({ success: true, data: theme });
    } catch (error) {
      next(error);
    }
  }

  async getLandingPage(req: Request, res: Response, next: NextFunction) {
    try {
      const subdomain = req.params.subdomain as string;
      const config = await storeService.getPublicLandingPage(subdomain);
      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentMethods(req: Request, res: Response, next: NextFunction) {
    try {
      const subdomain = req.params.subdomain as string;
      const store = await Store.findOne({ subdomain, status: 'active' });
      if (!store) throw new NotFoundError('Store not found');

      const integrations = store.integrations as Record<string, unknown[]>;
      const payments = (integrations?.payments as Record<string, unknown>[]) || [];

      const enabled: string[] = ['cod'];

      if (Array.isArray(payments)) {
        for (const p of payments) {
          if (typeof p === 'string') {
            enabled.push(p);
          } else if (p && typeof p === 'object' && (p as Record<string, unknown>).enabled) {
            enabled.push((p as Record<string, unknown>).provider as string);
          }
        }
      }

      res.json({ success: true, data: enabled });
    } catch (error) {
      next(error);
    }
  }
}

export const storefrontController = new StorefrontController();
