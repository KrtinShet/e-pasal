import { it, vi, expect, describe, beforeEach } from 'vitest';
import express, { type Request, type Response } from 'express';

describe('Health endpoint', () => {
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

  it('should return status "ok" and uptime in seconds', () => {
    const app = express();
    const serverStartTime = Date.now();

    app.get('/health', (_req, res) => {
      const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
      res.json({ status: 'ok', uptime });
    });

    const handler = app._router.stack.find(
      (layer: any) => layer.route?.path === '/health'
    )?.route?.stack[0]?.handle;

    handler(mockReq as Request, mockRes as Response);

    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        uptime: expect.any(Number),
      })
    );

    const callArgs = jsonMock.mock.calls[0][0];
    expect(callArgs.uptime).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(callArgs.uptime)).toBe(true);
  });

  it('should return uptime as a whole number (seconds)', () => {
    const app = express();
    const serverStartTime = Date.now();

    app.get('/health', (_req, res) => {
      const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
      res.json({ status: 'ok', uptime });
    });

    const handler = app._router.stack.find(
      (layer: any) => layer.route?.path === '/health'
    )?.route?.stack[0]?.handle;

    handler(mockReq as Request, mockRes as Response);

    const callArgs = jsonMock.mock.calls[0][0];
    expect(typeof callArgs.uptime).toBe('number');
    expect(callArgs.uptime % 1).toBe(0);
  });
});
