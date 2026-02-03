import { redis } from '../../lib/redis.js';
import { NotFoundError, ConflictError } from '../../lib/errors.js';

import { Store } from './store.model.js';
import type { IStore } from './store.model.js';

export class StoreService {
  async getById(id: string) {
    const store = await Store.findById(id);
    if (!store) {
      throw new NotFoundError('Store');
    }
    return store;
  }

  async getBySubdomain(subdomain: string) {
    const store = await Store.findOne({ subdomain, status: 'active' });
    if (!store) {
      throw new NotFoundError('Store');
    }
    return store;
  }

  async update(id: string, data: Partial<IStore>) {
    const store = await Store.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!store) {
      throw new NotFoundError('Store');
    }

    await this.invalidateCache(store.subdomain);

    return store;
  }

  async updateSettings(id: string, settings: Partial<IStore['settings']>) {
    const store = await Store.findById(id);
    if (!store) {
      throw new NotFoundError('Store');
    }

    store.settings = { ...store.settings, ...settings };
    await store.save();

    await this.invalidateCache(store.subdomain);

    return store;
  }

  async checkSubdomainAvailability(subdomain: string): Promise<boolean> {
    const existing = await Store.findOne({ subdomain });
    return !existing;
  }

  async updateCustomDomain(id: string, domain: string | null) {
    if (domain) {
      const existing = await Store.findOne({ customDomain: domain });
      if (existing && existing._id.toString() !== id) {
        throw new ConflictError('Domain already in use');
      }
    }

    const store = await Store.findByIdAndUpdate(
      id,
      { $set: { customDomain: domain } },
      { new: true }
    );

    if (!store) {
      throw new NotFoundError('Store');
    }

    return store;
  }

  private async invalidateCache(subdomain: string) {
    await redis.del(`tenant:${subdomain}`);
  }
}

export const storeService = new StoreService();
