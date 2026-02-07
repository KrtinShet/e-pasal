import crypto, { randomUUID } from 'node:crypto';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';
import { AppError, ConflictError, NotFoundError, UnauthorizedError } from '../../lib/errors.js';

import { User } from './user.model.js';

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
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

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await User.create({
      email: input.email,
      password: hashedPassword,
      name: input.name,
      phone: input.phone,
      role: 'merchant',
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
        hasStore: false,
        onboardingCompleted: false,
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
        hasStore: !!user.storeId,
        onboardingCompleted: user.onboardingCompleted,
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

  async me(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      storeId: user.storeId,
      hasStore: !!user.storeId,
      onboardingCompleted: user.onboardingCompleted,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
    });

    const resetUrl = `${env.DASHBOARD_URL}/reset-password/${resetToken}`;

    if (env.NODE_ENV === 'development') {
      console.log(`[DEV] Password reset URL for ${email}: ${resetUrl}`);
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokenId = randomUUID();
    await user.save();

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasStore: !!user.storeId,
        onboardingCompleted: user.onboardingCompleted,
      },
      tokens,
    };
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshTokenId: null });
  }

  generateTokens(user: any) {
    const accessToken = jwt.sign(
      {
        sub: user._id,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    const refreshToken = jwt.sign(
      { sub: user._id, type: 'refresh', tokenId: user.refreshTokenId },
      env.JWT_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
