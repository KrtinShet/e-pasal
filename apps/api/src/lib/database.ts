import mongoose from 'mongoose';

import { env } from '../config/env.js';

import { logger } from './logger.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: String(err) });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error: String(error) });
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}
