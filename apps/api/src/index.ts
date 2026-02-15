import 'dotenv/config';

import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { router } from './routes/index.js';
import { swaggerSpec } from './config/swagger.js';
import { connectRedis, isRedisReady } from './lib/redis.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import { tenantResolver } from './middleware/tenant-resolver.js';
import { connectDatabase, isDatabaseReady } from './lib/database.js';

const app = express();
const serverStartTime = Date.now();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [env.STOREFRONT_URL, env.DASHBOARD_URL, env.ADMIN_URL];
      if (
        !origin ||
        allowed.includes(origin) ||
        /^https?:\/\/[\w-]+\.localhost(:\d+)?$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(tenantResolver);

app.get('/health', (_req, res) => {
  const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
  res.json({
    status: 'ok',
    uptime,
    version: '0.0.1',
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', (_req, res) => {
  const readiness = {
    database: isDatabaseReady(),
    redis: isRedisReady(),
  };

  if (!readiness.database || !readiness.redis) {
    return res.status(503).json({
      status: 'degraded',
      readiness,
      timestamp: new Date().toISOString(),
    });
  }

  return res.json({
    status: 'ready',
    readiness,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/version', (_req, res) => {
  res.json({ version: '0.0.1', name: 'baazarify' });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

app.use(`/api/${env.API_VERSION}`, router);

app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  await connectRedis();

  app.listen(env.PORT, () => {
    logger.info('API server started', { port: env.PORT, env: env.NODE_ENV });
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', { error: String(err) });
  process.exit(1);
});

export { app };
