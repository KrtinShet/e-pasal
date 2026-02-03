import { it, vi, expect, describe } from 'vitest';

vi.mock('./auth.controller.js', () => ({
  authController: {
    register: vi.fn(),
    login: vi.fn(),
    refresh: vi.fn(),
    me: vi.fn(),
  },
  registerSchema: { parse: (v: unknown) => v },
  loginSchema: { parse: (v: unknown) => v },
  refreshSchema: { parse: (v: unknown) => v },
}));

vi.mock('../../middleware/auth.js', () => ({
  authenticate: vi.fn((_req, _res, next) => next()),
}));

import { authRouter } from './auth.routes.js';

describe('auth routes smoke', () => {
  it('registers expected auth endpoints', () => {
    const routes = authRouter.stack
      .filter((layer: any) => layer.route)
      .map((layer: any) => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));

    expect(routes).toEqual(
      expect.arrayContaining([
        { path: '/register', methods: ['post'] },
        { path: '/login', methods: ['post'] },
        { path: '/refresh', methods: ['post'] },
        { path: '/me', methods: ['get'] },
      ])
    );
  });
});
