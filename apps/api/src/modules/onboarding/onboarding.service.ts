import { randomUUID } from 'node:crypto';

import { User } from '../auth/user.model.js';
import { Store } from '../store/store.model.js';
import { authService } from '../auth/auth.service.js';
import { ConflictError, NotFoundError } from '../../lib/errors.js';

interface OnboardingInput {
  storeName: string;
  subdomain: string;
  description?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  logo?: string;
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}

export class OnboardingService {
  async complete(userId: string, input: OnboardingInput) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (user.storeId) {
      throw new ConflictError('User already has a store');
    }

    const existingSubdomain = await Store.findOne({ subdomain: input.subdomain });
    if (existingSubdomain) {
      throw new ConflictError('Subdomain already taken');
    }

    const store = await Store.create({
      name: input.storeName,
      subdomain: input.subdomain,
      description: input.description,
      logo: input.logo,
      status: 'active',
      plan: 'free',
      contact: input.contact,
      settings: {
        currency: 'NPR',
        timezone: 'Asia/Kathmandu',
        language: 'en',
        theme: {
          primaryColor: input.theme?.primaryColor ?? '#2563eb',
          accentColor: input.theme?.accentColor ?? '#f59e0b',
        },
      },
    });

    user.storeId = store._id;
    user.onboardingCompleted = true;
    user.refreshTokenId = randomUUID();
    await user.save();

    const tokens = authService.generateTokens(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        storeId: store._id,
        hasStore: true,
        onboardingCompleted: true,
      },
      store: {
        id: store._id,
        name: store.name,
        subdomain: store.subdomain,
      },
      tokens,
    };
  }
}

export const onboardingService = new OnboardingService();
