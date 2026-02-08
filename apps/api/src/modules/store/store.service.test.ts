import { it, vi, expect, describe, beforeEach } from 'vitest';

vi.mock('../../lib/redis.js', () => ({
  redis: {
    del: vi.fn(),
  },
}));

vi.mock('./store.model.js', () => ({
  Store: {
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findOne: vi.fn(),
  },
}));

import { redis } from '../../lib/redis.js';

import { Store } from './store.model.js';
import { storeService } from './store.service.js';

describe('storeService landing pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('normalizes legacy single-page draft config into version 2 shape', async () => {
    const legacyDraft = {
      id: 'page-home',
      slug: '/',
      title: 'Home',
      sections: [
        {
          id: 'section-1',
          type: 'hero',
          props: { headline: 'Welcome' },
          visible: true,
        },
      ],
      seo: {},
    };

    const lean = vi.fn().mockResolvedValue({
      landingPage: {
        draftConfig: legacyDraft,
      },
    });

    const select = vi.fn().mockReturnValue({ lean });
    vi.mocked(Store.findById).mockReturnValue({ select } as never);

    const result = await storeService.getLandingPageDraft('store-1');

    expect(result).toEqual({
      version: 2,
      pages: [legacyDraft],
      homePageId: 'page-home',
    });
  });

  it('saves multi-page draft config as normalized version 2 shape', async () => {
    const input = {
      version: 2 as const,
      pages: [
        { id: 'home', slug: '/', title: 'Home', sections: [], seo: {} },
        { id: 'about', slug: '/about', title: 'About', sections: [], seo: {} },
      ],
      homePageId: 'home',
    };

    vi.mocked(Store.findByIdAndUpdate).mockResolvedValue({
      landingPage: {
        draftConfig: input,
      },
    } as never);

    const result = await storeService.saveLandingPageDraft('store-1', input);

    expect(Store.findByIdAndUpdate).toHaveBeenCalledWith(
      'store-1',
      { $set: { 'landingPage.draftConfig': input } },
      { new: true }
    );
    expect(result).toEqual(input);
  });

  it('publishes only requested page from draft without replacing other published pages', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const markModified = vi.fn();

    const storeDoc: any = {
      subdomain: 'demo',
      landingPage: {
        draftConfig: {
          version: 2,
          pages: [
            { id: 'home', slug: '/', title: 'Home', sections: [], seo: {} },
            { id: 'about', slug: '/about', title: 'About Draft', sections: [], seo: {} },
          ],
          homePageId: 'home',
        },
        config: {
          version: 2,
          pages: [
            { id: 'home', slug: '/', title: 'Home Live', sections: [], seo: {} },
            { id: 'contact', slug: '/contact', title: 'Contact', sections: [], seo: {} },
          ],
          homePageId: 'home',
        },
      },
      save,
      markModified,
    };

    vi.mocked(Store.findById).mockResolvedValue(storeDoc);

    const result = await storeService.publishLandingPage('store-1', 'about');

    expect(result).toEqual({
      version: 2,
      pages: [
        { id: 'home', slug: '/', title: 'Home Live', sections: [], seo: {} },
        { id: 'contact', slug: '/contact', title: 'Contact', sections: [], seo: {} },
        { id: 'about', slug: '/about', title: 'About Draft', sections: [], seo: {} },
      ],
      homePageId: 'home',
    });

    expect(markModified).toHaveBeenCalledWith('landingPage');
    expect(save).toHaveBeenCalled();
    expect(vi.mocked(redis.del)).toHaveBeenCalledWith('tenant:demo');
  });

  it('unpublishes a single page and keeps remaining published pages', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const markModified = vi.fn();

    const storeDoc: any = {
      subdomain: 'demo',
      landingPage: {
        config: {
          version: 2,
          pages: [
            { id: 'home', slug: '/', title: 'Home', sections: [], seo: {} },
            { id: 'about', slug: '/about', title: 'About', sections: [], seo: {} },
          ],
          homePageId: 'home',
        },
      },
      save,
      markModified,
    };

    vi.mocked(Store.findById).mockResolvedValue(storeDoc);

    const result = await storeService.unpublishLandingPage('store-1', 'about');

    expect(result).toEqual({
      version: 2,
      pages: [{ id: 'home', slug: '/', title: 'Home', sections: [], seo: {} }],
      homePageId: 'home',
    });
    expect(markModified).toHaveBeenCalledWith('landingPage');
    expect(save).toHaveBeenCalled();
    expect(vi.mocked(redis.del)).toHaveBeenCalledWith('tenant:demo');
  });
});
