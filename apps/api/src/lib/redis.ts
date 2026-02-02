import Redis from 'ioredis';
import { env } from '../config/env.js';

export let redis: Redis;

export async function connectRedis() {
  try {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    await redis.connect();
    console.log('✅ Connected to Redis');

    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    process.exit(1);
  }
}

export async function disconnectRedis() {
  await redis.quit();
}
