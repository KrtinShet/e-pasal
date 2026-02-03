import type { Request, Response, NextFunction } from 'express';

import { redis } from '../lib/redis.js';
import { AppError } from '../lib/errors.js';
import { Store } from '../modules/store/store.model.js';

declare global {
  namespace Express {
    interface Request {
      storeId?: string;
      store?: {
        id: string;
        name: string;
        subdomain: string;
        plan: string;
      };
    }
  }
}

const TENANT_CACHE_TTL = 300; // 5 minutes

export async function tenantResolver(req: Request, _res: Response, next: NextFunction) {
  try {
    const host = req.headers.host || '';
    const subdomain = extractSubdomain(host);

    if (!subdomain) {
      return next();
    }

    const cacheKey = `tenant:${subdomain}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      const store = JSON.parse(cached);
      req.storeId = store.id;
      req.store = store;
      return next();
    }

    const store = await Store.findOne({ subdomain }).lean();

    if (!store) {
      return next(new AppError('Store not found for subdomain', 404, 'TENANT_NOT_FOUND'));
    }

    if (store.status !== 'active') {
      return next(new AppError('Store is not active', 403, 'TENANT_INACTIVE'));
    }

    const storeData = {
      id: store._id.toString(),
      name: store.name,
      subdomain: store.subdomain,
      plan: store.plan,
    };

    await redis.setex(cacheKey, TENANT_CACHE_TTL, JSON.stringify(storeData));

    req.storeId = storeData.id;
    req.store = storeData;

    next();
  } catch (error) {
    next(error);
  }
}

function extractSubdomain(host: string): string | null {
  const parts = host.split('.');
  if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'api') {
    return parts[0];
  }
  return null;
}
