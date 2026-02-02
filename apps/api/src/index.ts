import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDatabase } from './lib/database.js';
import { connectRedis } from './lib/redis.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import { tenantResolver } from './middleware/tenant-resolver.js';
import { router } from './routes/index.js';
import { env } from './config/env.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: [env.STOREFRONT_URL, env.DASHBOARD_URL, env.ADMIN_URL],
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(tenantResolver);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(`/api/${env.API_VERSION}`, router);

app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  await connectRedis();

  app.listen(env.PORT, () => {
    console.log(`🚀 API server running on port ${env.PORT}`);
    console.log(`📍 Environment: ${env.NODE_ENV}`);
  });
}

bootstrap().catch(console.error);

export { app };
