import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(7100),
  API_VERSION: z.string().default('v1'),

  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  S3_ENDPOINT: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_REGION: z.string().default('sgp1'),

  STOREFRONT_URL: z.string().url().default('http://localhost:7103'),
  DASHBOARD_URL: z.string().url().default('http://localhost:7102'),
  ADMIN_URL: z.string().url().default('http://localhost:7101'),

  AI_PROVIDER: z.enum(['anthropic', 'none']).default('none'),
  ANTHROPIC_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
