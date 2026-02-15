import Redis from 'ioredis';

import { env } from '../config/env.js';

import { logger } from './logger.js';

export let redis: Redis;

export async function connectRedis() {
  try {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    await redis.connect();
    logger.info('Connected to Redis');

    redis.on('error', (err) => {
      logger.error('Redis connection error', { error: String(err) });
    });
  } catch (error) {
    logger.error('Failed to connect to Redis', { error: String(error) });
    process.exit(1);
  }
}

export async function disconnectRedis() {
  await redis.quit();
}

export function isRedisReady() {
  return Boolean(redis) && redis.status === 'ready';
}
