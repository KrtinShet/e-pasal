import { it, vi, expect, describe, beforeEach } from 'vitest';

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

vi.mock('../../config/env.js', () => ({
  env: {
    JWT_SECRET: 'test-secret-that-is-long-enough-for-tests',
    JWT_ACCESS_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
    DASHBOARD_URL: 'http://localhost:5173',
    NODE_ENV: 'development',
  },
}));

vi.mock('./user.model.js', () => ({
  User: {
    findOne: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

vi.mock('../store/store.model.js', () => ({
  Store: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { ConflictError } from '../../lib/errors.js';

import { User } from './user.model.js';
import { authService } from './auth.service.js';

describe('authService.register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates user only (no store) and returns tokens', async () => {
    vi.mocked(User.findOne).mockResolvedValue(null as never);

    vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);

    vi.mocked(User.create).mockResolvedValue({
      _id: 'user-1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'merchant',
      onboardingCompleted: false,
    } as never);

    vi.mocked(jwt.sign)
      .mockReturnValueOnce('access-token' as never)
      .mockReturnValueOnce('refresh-token' as never);

    const result = await authService.register({
      email: 'demo@example.com',
      password: 'password123',
      name: 'Demo User',
    });

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'demo@example.com',
        password: 'hashed-password',
        role: 'merchant',
      })
    );

    expect(result.user.hasStore).toBe(false);
    expect(result.user.onboardingCompleted).toBe(false);
    expect(result.tokens).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('throws conflict when email already exists', async () => {
    vi.mocked(User.findOne).mockResolvedValue({ _id: 'user-existing' } as never);

    await expect(
      authService.register({
        email: 'demo@example.com',
        password: 'password123',
        name: 'Demo User',
      })
    ).rejects.toBeInstanceOf(ConflictError);

    expect(User.create).not.toHaveBeenCalled();
  });
});
