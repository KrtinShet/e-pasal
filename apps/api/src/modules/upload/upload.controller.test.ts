import { it, vi, expect, describe, beforeEach } from 'vitest';

vi.mock('./s3.provider.js', () => ({
  s3Provider: {
    upload: vi.fn(),
  },
}));

vi.mock('node:crypto', () => ({
  randomUUID: vi.fn(() => 'fixed-uuid'),
}));

import { s3Provider } from './s3.provider.js';
import { uploadController } from './upload.controller.js';

describe('uploadController.uploadImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads image and returns metadata', async () => {
    vi.mocked(s3Provider.upload).mockResolvedValue({
      key: 'images/store-1/fixed-uuid.png',
      url: 'https://cdn.example.com/images/store-1/fixed-uuid.png',
      size: 4,
      contentType: 'image/png',
    } as never);

    const req: any = {
      user: { storeId: 'store-1', id: 'user-1' },
      file: {
        originalname: 'product.png',
        mimetype: 'image/png',
        buffer: Buffer.from('test'),
      },
    };

    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const res: any = { status, json };
    const next = vi.fn();

    await uploadController.uploadImage(req, res, next);

    expect(s3Provider.upload).toHaveBeenCalledWith(
      expect.any(Buffer),
      'images/store-1/fixed-uuid.png',
      'image/png'
    );
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(next).not.toHaveBeenCalled();
  });

  it('passes error to next when no file is provided', async () => {
    const req: any = { user: { storeId: 'store-1', id: 'user-1' } };
    const next = vi.fn();

    await uploadController.uploadImage(req, {} as any, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
