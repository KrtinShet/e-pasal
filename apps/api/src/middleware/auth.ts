import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';
import { User } from '../modules/auth/user.model.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        storeId?: string;
      };
    }
  }
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  storeId?: string;
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.sub).select('-password').lean();

    if (!user || user.status !== 'active') {
      throw new AppError('User not found or inactive', 401, 'UNAUTHORIZED');
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      storeId: user.storeId?.toString(),
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
    }
    next(error);
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401, 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
    }

    next();
  };
}

export function requireStore(req: Request, _res: Response, next: NextFunction) {
  if (!req.user?.storeId) {
    return next(new AppError('Store context required', 400, 'STORE_REQUIRED'));
  }
  next();
}
