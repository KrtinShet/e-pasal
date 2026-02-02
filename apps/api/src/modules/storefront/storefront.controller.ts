import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Store } from '../store/store.model.js';
import { Product } from '../product/product.model.js';
import { Category } from '../category/category.model.js';
import { orderService } from '../order/order.service.js';
import { customerService } from '../customer/customer.service.js';
import { NotFoundError } from '../../lib/errors.js';

const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc']).default('newest'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().min(1),
  })).min(1),
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
      }).select('-integrations').lean();

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

      const order = await orderService.getByOrderNumber(
        store._id.toString(),
        orderNumber
      );

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
}

export const storefrontController = new StorefrontController();
