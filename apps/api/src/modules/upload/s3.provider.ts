import path from 'node:path';
import { promises as fs } from 'node:fs';

import { env } from '../../config/env.js';

import type { UploadResult, StorageProvider } from './storage.interface.js';

class S3Provider implements StorageProvider {
  private readonly bucket: string;
  private readonly baseDir: string;

  constructor() {
    this.bucket = env.S3_BUCKET || 'uploads';
    this.baseDir = path.resolve(process.cwd(), 'tmp', this.bucket);
  }

  async upload(file: Buffer, key: string, contentType: string): Promise<UploadResult> {
    const filePath = path.join(this.baseDir, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file);

    const url = this.toPublicUrl(key);

    return {
      key,
      url,
      size: file.length,
      contentType,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.baseDir, key);
    await fs.rm(filePath, { force: true });
  }

  async getSignedUrl(key: string): Promise<string> {
    return this.toPublicUrl(key);
  }

  private toPublicUrl(key: string) {
    if (env.S3_ENDPOINT) {
      return `${env.S3_ENDPOINT.replace(/\/$/, '')}/${this.bucket}/${key}`;
    }

    return `/uploads/${this.bucket}/${key}`;
  }
}

export const s3Provider = new S3Provider();
