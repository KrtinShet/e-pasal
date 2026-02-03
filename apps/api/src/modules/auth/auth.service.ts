import { randomUUID } from 'node:crypto';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';
import { Store } from '../store/store.model.js';
import { AppError, ConflictError, UnauthorizedError } from '../../lib/errors.js';

import { User } from './user.model.js';

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  storeName: string;
  subdomain: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const existingSubdomain = await Store.findOne({ subdomain: input.subdomain });
    if (existingSubdomain) {
      throw new ConflictError('Subdomain already taken');
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const store = await Store.create({
      name: input.storeName,
      subdomain: input.subdomain,
      status: 'active',
      plan: 'free',
    });

    const user = await User.create({
      email: input.email,
      password: hashedPassword,
      name: input.name,
      phone: input.phone,
      role: 'merchant',
      storeId: store._id,
      status: 'active',
      refreshTokenId: randomUUID(),
    });

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      store: {
        id: store._id,
        name: store.name,
        subdomain: store.subdomain,
      },
      tokens,
    };
  }

  async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new AppError('Account is not active', 403, 'ACCOUNT_INACTIVE');
    }

    user.lastLoginAt = new Date();
    await user.save();

    user.refreshTokenId = randomUUID();
    await user.save();

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        storeId: user.storeId,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as {
        sub: string;
        type: string;
        tokenId?: string;
      };

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedError('Invalid token type');
      }

      const user = await User.findById(decoded.sub);
      if (!user || user.status !== 'active') {
        throw new UnauthorizedError('User not found or inactive');
      }

      if (!decoded.tokenId || user.refreshTokenId !== decoded.tokenId) {
        throw new UnauthorizedError('Refresh token has been revoked');
      }

      user.refreshTokenId = randomUUID();
      await user.save();

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  private generateTokens(user: any) {
    const accessToken = jwt.sign(
      {
        sub: user._id,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { sub: user._id, type: 'refresh', tokenId: user.refreshTokenId },
      env.JWT_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
