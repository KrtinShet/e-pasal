import crypto from 'node:crypto';

import { env } from '../../../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getKey(): Buffer {
  const key = env.INTEGRATION_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('INTEGRATION_ENCRYPTION_KEY is not configured');
  }
  return crypto.scryptSync(key, 'baazarify-salt', 32);
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

export function decrypt(ciphertext: string): string {
  const key = getKey();
  const [ivHex, tagHex, encrypted] = ciphertext.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function maskSecret(value: string): string {
  if (value.length <= 4) return '****';
  return '****' + value.slice(-4);
}
