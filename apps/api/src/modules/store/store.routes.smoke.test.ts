import { it, vi, expect, describe } from 'vitest';

vi.mock('./store.controller.js', () => ({
  storeController: {
    checkSubdomain: vi.fn(),
    getMyStore: vi.fn(),
    updateMyStore: vi.fn(),
    updateSettings: vi.fn(),
  },
}));

vi.mock('../../middleware/auth.js', () => ({
  authenticate: vi.fn((_req, _res, next) => next()),
  requireStore: vi.fn((_req, _res, next) => next()),
}));

import { storeRouter } from './store.routes.js';

describe('store routes smoke', () => {
  it('registers expected store endpoints', () => {
    const routes = storeRouter.stack
      .filter((layer: any) => layer.route)
      .map((layer: any) => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));

    expect(routes).toEqual(
      expect.arrayContaining([
        { path: '/check/:subdomain', methods: ['get'] },
        { path: '/me', methods: ['get'] },
        { path: '/me', methods: ['patch'] },
        { path: '/me/settings', methods: ['patch'] },
      ])
    );
  });
});
