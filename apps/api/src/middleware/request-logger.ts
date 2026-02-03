import { randomUUID } from 'node:crypto';

import type { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'secret', 'apiKey', 'refreshToken'];

function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
      (acc, [key, val]) => {
        const shouldRedact = SENSITIVE_KEYS.some((sensitive) =>
          key.toLowerCase().includes(sensitive.toLowerCase())
        );
        acc[key] = shouldRedact ? '[REDACTED]' : redact(val);
        return acc;
      },
      {}
    );
  }

  return value;
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers['x-request-id']?.toString() ?? randomUUID();
  const start = Date.now();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  const payload = {
    requestId,
    method: req.method,
    path: req.path,
    query: redact(req.query),
    body: redact(req.body),
  };

  console.log(JSON.stringify({ level: 'info', event: 'request.start', ...payload }));

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    console.log(
      JSON.stringify({
        level: 'info',
        event: 'request.finish',
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs,
      })
    );
  });

  next();
}
