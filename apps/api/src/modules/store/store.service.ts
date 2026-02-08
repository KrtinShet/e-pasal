import type { PageConfig, LandingPagesConfig } from '@baazarify/storefront-builder';

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
    const normalized = this.normalizeLandingPagesConfig(
      store.landingPage?.draftConfig ?? store.landingPage?.config
    );
    return normalized;
  }

  async saveLandingPageDraft(id: string, config: LandingPagesConfig) {
    const normalized = this.normalizeLandingPagesConfig(config);

    const store = await Store.findByIdAndUpdate(
      id,
      { $set: { 'landingPage.draftConfig': normalized } },
      { new: true }
    );
    if (!store) {
      throw new NotFoundError('Store');
    }

    return this.normalizeLandingPagesConfig(store.landingPage?.draftConfig);
  }

  async publishLandingPage(id: string, pageId: string) {
    const store = await Store.findById(id);
    if (!store) {
      throw new NotFoundError('Store');
    }

    const draft = this.normalizeLandingPagesConfig(store.landingPage?.draftConfig);
    if (!draft) {
      throw new NotFoundError('No draft to publish');
    }

    const pageToPublish = draft.pages.find((page) => page.id === pageId);
    if (!pageToPublish) {
      throw new NotFoundError('Draft page');
    }

    const published =
      this.normalizeLandingPagesConfig(store.landingPage?.config) ??
      ({
        version: 2,
        pages: [],
      } satisfies LandingPagesConfig);

    const existingIndex = published.pages.findIndex((page) => page.id === pageToPublish.id);
    if (existingIndex >= 0) {
      published.pages[existingIndex] = pageToPublish;
    } else {
      published.pages.push(pageToPublish);
    }

    if (!store.landingPage) {
      store.landingPage = {} as IStore['landingPage'];
    }

    store.landingPage.config = {
      version: 2,
      pages: published.pages,
      homePageId: this.resolveHomePageId(
        pageToPublish.slug === '/' ? pageToPublish.id : (published.homePageId ?? draft.homePageId),
        published.pages
      ),
    };

    store.markModified('landingPage');
    await store.save();

    await this.invalidateCache(store.subdomain);
    return this.normalizeLandingPagesConfig(store.landingPage?.config);
  }

  async unpublishLandingPage(id: string, pageId: string) {
    const store = await Store.findById(id);
    if (!store) {
      throw new NotFoundError('Store');
    }

    const published = this.normalizeLandingPagesConfig(store.landingPage?.config);
    if (!published) {
      throw new NotFoundError('No published pages');
    }

    const nextPages = published.pages.filter((page) => page.id !== pageId);
    if (nextPages.length === published.pages.length) {
      throw new NotFoundError('Published page');
    }

    if (!store.landingPage) {
      store.landingPage = {} as IStore['landingPage'];
    }

    if (nextPages.length === 0) {
      store.landingPage.config = undefined;
    } else {
      store.landingPage.config = {
        version: 2,
        pages: nextPages,
        homePageId: this.resolveHomePageId(published.homePageId, nextPages),
      };
    }

    store.markModified('landingPage');
    await store.save();

    await this.invalidateCache(store.subdomain);
    return this.normalizeLandingPagesConfig(store.landingPage?.config);
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
    const normalized = this.normalizeLandingPagesConfig(store.landingPage?.config);
    return normalized && normalized.pages.length > 0 ? normalized : null;
  }

  private async invalidateCache(subdomain: string) {
    await redis.del(`tenant:${subdomain}`);
  }

  private normalizeLandingPagesConfig(config: unknown): LandingPagesConfig | null {
    if (!this.isRecord(config)) return null;

    if (config.version === 2 && Array.isArray(config.pages)) {
      const pages = this.normalizePages(config.pages);
      return {
        version: 2,
        pages,
        homePageId: this.resolveHomePageId(
          typeof config.homePageId === 'string' ? config.homePageId : undefined,
          pages
        ),
      };
    }

    const legacyPage = this.normalizePageConfig(config);
    if (!legacyPage) return null;

    return {
      version: 2,
      pages: [legacyPage],
      homePageId: legacyPage.id,
    };
  }

  private normalizePages(rawPages: unknown[]): PageConfig[] {
    const seenIds = new Set<string>();
    const pages: PageConfig[] = [];

    for (const rawPage of rawPages) {
      const page = this.normalizePageConfig(rawPage);
      if (!page) continue;

      let id = page.id;
      let suffix = 2;
      while (seenIds.has(id)) {
        id = `${page.id}-${suffix}`;
        suffix += 1;
      }
      seenIds.add(id);

      pages.push({ ...page, id });
    }

    return pages;
  }

  private normalizePageConfig(rawPage: unknown): PageConfig | null {
    if (!this.isRecord(rawPage)) return null;

    const id = typeof rawPage.id === 'string' && rawPage.id.trim() ? rawPage.id.trim() : null;
    const title =
      typeof rawPage.title === 'string' && rawPage.title.trim() ? rawPage.title.trim() : null;
    const slug = this.normalizeSlug(rawPage.slug);

    if (!id || !title || !slug) return null;

    const sectionsRaw = Array.isArray(rawPage.sections) ? rawPage.sections : [];
    const sections = sectionsRaw
      .map((section, index) => this.normalizeSection(section, index))
      .filter((section): section is PageConfig['sections'][number] => section !== null);

    const seo = this.isRecord(rawPage.seo) ? rawPage.seo : {};

    return {
      id,
      slug,
      title,
      sections,
      seo: {
        title: typeof seo.title === 'string' ? seo.title : undefined,
        description: typeof seo.description === 'string' ? seo.description : undefined,
        ogImage: typeof seo.ogImage === 'string' ? seo.ogImage : undefined,
      },
    };
  }

  private normalizeSection(section: unknown, index: number) {
    if (!this.isRecord(section)) return null;

    const id =
      typeof section.id === 'string' && section.id.trim()
        ? section.id.trim()
        : `section-${index + 1}`;
    const type =
      typeof section.type === 'string' && section.type.trim() ? section.type.trim() : null;
    if (!type) return null;

    const props = this.isRecord(section.props) ? section.props : {};

    return {
      id,
      type,
      props,
      visible: typeof section.visible === 'boolean' ? section.visible : true,
    };
  }

  private resolveHomePageId(homePageId: string | undefined, pages: PageConfig[]) {
    if (homePageId && pages.some((page) => page.id === homePageId)) return homePageId;

    const rootPage = pages.find((page) => page.slug === '/');
    if (rootPage) return rootPage.id;

    return pages[0]?.id;
  }

  private normalizeSlug(rawSlug: unknown): string | null {
    if (typeof rawSlug !== 'string') return null;

    const trimmed = rawSlug.trim();
    if (!trimmed) return null;
    if (trimmed === '/') return '/';

    const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '');
    return withoutTrailingSlash || '/';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}

export const storeService = new StoreService();
