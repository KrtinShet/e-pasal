import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
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

  ESEWA_MERCHANT_CODE: z.string().default('EPAYTEST'),
  ESEWA_SECRET_KEY: z.string().default('8gBm/:&EnhH.1/q'),
  ESEWA_BASE_URL: z.string().default('https://rc-epay.esewa.com.np'),

  KHALTI_SECRET_KEY: z.string().optional(),
  KHALTI_PUBLIC_KEY: z.string().optional(),
  KHALTI_BASE_URL: z.string().default('https://dev.khalti.com'),

  FONEPAY_MERCHANT_CODE: z.string().optional(),
  FONEPAY_SECRET_KEY: z.string().optional(),
  FONEPAY_BASE_URL: z.string().default('https://dev-clientapi.fonepay.com'),

  PATHAO_CLIENT_ID: z.string().optional(),
  PATHAO_CLIENT_SECRET: z.string().optional(),
  PATHAO_USERNAME: z.string().optional(),
  PATHAO_PASSWORD: z.string().optional(),

  INTEGRATION_ENCRYPTION_KEY: z.string().optional(),

  WEBHOOK_BASE_URL: z.string().default('http://localhost:7100'),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default('noreply@baazarify.com'),

  SENTRY_DSN: z.string().optional(),

  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

function parseEnv() {
  const isTest = process.env.NODE_ENV === 'test';
  const result = envSchema.safeParse(
    isTest
      ? {
          ...process.env,
          MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27117/baazarify-test',
          REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6479',
          JWT_SECRET: process.env.JWT_SECRET || 'test-secret-key-minimum-32-characters-long',
        }
      : process.env
  );

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  return result.data;
}

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
