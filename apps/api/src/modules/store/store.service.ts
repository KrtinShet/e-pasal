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

  async getTheme(id: string) {
    const store = await Store.findById(id).select('settings.theme').lean();
    if (!store) {
      throw new NotFoundError('Store');
    }
    return store.settings.theme;
  }

  async updateTheme(id: string, theme: Partial<IStore['settings']['theme']>) {
    const store = await Store.findById(id);
    if (!store) {
      throw new NotFoundError('Store');
    }

    if (theme.preset !== undefined) store.settings.theme.preset = theme.preset;
    if (theme.tokens !== undefined) store.settings.theme.tokens = theme.tokens;
    if (theme.primaryColor !== undefined) store.settings.theme.primaryColor = theme.primaryColor;
    if (theme.accentColor !== undefined) store.settings.theme.accentColor = theme.accentColor;
    store.markModified('settings.theme');
    await store.save();

    await this.invalidateCache(store.subdomain);
    return store.settings.theme;
  }

  async resetTheme(id: string) {
    const store = await Store.findById(id);
    if (!store) {
      throw new NotFoundError('Store');
    }

    store.settings.theme = {
      primaryColor: '#2563eb',
      accentColor: '#f59e0b',
      preset: undefined,
      tokens: undefined,
    };
    store.markModified('settings.theme');
    await store.save();

    await this.invalidateCache(store.subdomain);
    return store.settings.theme;
  }

  async applyPreset(id: string, presetName: string) {
    const store = await Store.findById(id);
    if (!store) {
      throw new NotFoundError('Store');
    }

    store.settings.theme.preset = presetName;
    store.markModified('settings.theme');
    await store.save();

    await this.invalidateCache(store.subdomain);
    return store.settings.theme;
  }

  async getLandingPageDraft(id: string) {
    const store = await Store.findById(id)
      .select('landingPage.draftConfig landingPage.config')
      .lean();
    if (!store) {
      throw new NotFoundError('Store');
    }
    return store.landingPage?.draftConfig || store.landingPage?.config || null;
  }

  async saveLandingPageDraft(id: string, config: Record<string, unknown>) {
    const store = await Store.findByIdAndUpdate(
      id,
      { $set: { 'landingPage.draftConfig': config } },
      { new: true }
    );
    if (!store) {
      throw new NotFoundError('Store');
    }
    return store.landingPage.draftConfig;
  }

  async publishLandingPage(id: string) {
    const store = await Store.findById(id);
    if (!store) {
      throw new NotFoundError('Store');
    }

    if (!store.landingPage?.draftConfig) {
      throw new NotFoundError('No draft to publish');
    }

    store.landingPage.config = store.landingPage.draftConfig;
    store.markModified('landingPage');
    await store.save();

    await this.invalidateCache(store.subdomain);
    return store.landingPage.config;
  }

  async getPublicTheme(subdomain: string) {
    const store = await Store.findOne({ subdomain, status: 'active' })
      .select('settings.theme')
      .lean();
    if (!store) {
      throw new NotFoundError('Store');
    }
    return store.settings.theme;
  }

  async getPublicLandingPage(subdomain: string) {
    const store = await Store.findOne({ subdomain, status: 'active' })
      .select('landingPage.config')
      .lean();
    if (!store) {
      throw new NotFoundError('Store');
    }
    return store.landingPage?.config || null;
  }

  private async invalidateCache(subdomain: string) {
    await redis.del(`tenant:${subdomain}`);
  }
}

export const storeService = new StoreService();
