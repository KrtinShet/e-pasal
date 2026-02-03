import { it, vi, expect, describe, beforeEach } from 'vitest';

vi.mock('../lib/redis.js', () => ({
  redis: {
    get: vi.fn(),
    setex: vi.fn(),
  },
}));

vi.mock('../modules/store/store.model.js', () => ({
  Store: {
    findOne: vi.fn(),
  },
}));

import { redis } from '../lib/redis.js';
import { Store } from '../modules/store/store.model.js';

import { tenantResolver } from './tenant-resolver.js';

describe('tenantResolver middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hydrates tenant from cache when available', async () => {
    vi.mocked(redis.get).mockResolvedValue(
      JSON.stringify({
        id: 'store-1',
        name: 'Demo',
        subdomain: 'demo',
        plan: 'free',
      }) as never
    );

    const req: any = { headers: { host: 'demo.example.com' } };
    const next = vi.fn();

    await tenantResolver(req, {} as any, next);

    expect(req.storeId).toBe('store-1');
    expect(req.store).toEqual(
      expect.objectContaining({
        subdomain: 'demo',
      })
    );
    expect(Store.findOne).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('queries store and caches tenant when cache is empty', async () => {
    vi.mocked(redis.get).mockResolvedValue(null as never);
    vi.mocked(Store.findOne).mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: 'store-2',
        name: 'Second',
        subdomain: 'second',
        plan: 'starter',
        status: 'active',
      }),
    } as never);

    const req: any = { headers: { host: 'second.example.com' } };
    const next = vi.fn();

    await tenantResolver(req, {} as any, next);

    expect(Store.findOne).toHaveBeenCalledWith({
      subdomain: 'second',
    });
    expect(redis.setex).toHaveBeenCalled();
    expect(req.storeId).toBe('store-2');
    expect(next).toHaveBeenCalled();
  });
});
