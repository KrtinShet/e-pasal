import type { MetadataRoute } from 'next';

import { isIndexableEnvironment } from '@/lib/seo';

const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'baazarify.com';

export default function robots(): MetadataRoute.Robots {
  const shouldIndex = isIndexableEnvironment();

  if (!shouldIndex) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/cart',
          '/checkout',
          '/checkout/*',
          '/account',
          '/account/*',
          '/orders',
          '/orders/*',
          '/_next/',
          '/static/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/cart',
          '/checkout',
          '/checkout/*',
          '/account',
          '/account/*',
          '/orders',
          '/orders/*',
        ],
      },
    ],
    sitemap: `https://*.${DEFAULT_DOMAIN}/sitemap.xml`,
  };
}
