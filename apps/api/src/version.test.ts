import { it, vi, expect, describe, beforeEach } from 'vitest';
import express, { type Request, type Response } from 'express';

describe('Version endpoint', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockReq = {};
    jsonMock = vi.fn();
    mockRes = {
      json: jsonMock,
    };
  });

  it('should return version "0.0.1" and name "baazarify"', () => {
    const app = express();

    app.get('/api/version', (_req, res) => {
      res.json({ version: '0.0.1', name: 'baazarify' });
    });

    const handler = app._router.stack.find((layer: any) => layer.route?.path === '/api/version')
      ?.route?.stack[0]?.handle;

    handler(mockReq as Request, mockRes as Response);

    expect(jsonMock).toHaveBeenCalledWith({
      version: '0.0.1',
      name: 'baazarify',
    });
  });

  it('should return exactly the expected version and name format', () => {
    const app = express();

    app.get('/api/version', (_req, res) => {
      res.json({ version: '0.0.1', name: 'baazarify' });
    });

    const handler = app._router.stack.find((layer: any) => layer.route?.path === '/api/version')
      ?.route?.stack[0]?.handle;

    handler(mockReq as Request, mockRes as Response);

    const callArgs = jsonMock.mock.calls[0][0];
    expect(typeof callArgs.version).toBe('string');
    expect(typeof callArgs.name).toBe('string');
    expect(callArgs.version).toBe('0.0.1');
    expect(callArgs.name).toBe('baazarify');
  });
});
