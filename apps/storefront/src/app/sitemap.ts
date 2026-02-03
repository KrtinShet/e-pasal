import { headers } from 'next/headers';
import type { MetadataRoute } from 'next';

import { getStoreBaseUrl, isIndexableEnvironment } from '@/lib/seo';
import {
  getStoreBySubdomain,
  getAllProductsForSitemap,
  getAllCategoriesForSitemap,
} from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexableEnvironment()) {
    return [];
  }

  const headersList = await headers();
  const subdomain = headersList.get('x-store-subdomain');

  if (!subdomain) {
    return [];
  }

  const store = await getStoreBySubdomain(subdomain);

  if (!store) {
    return [];
  }

  const baseUrl = getStoreBaseUrl(store, subdomain);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const [products, categories] = await Promise.all([
    getAllProductsForSitemap(subdomain),
    getAllCategoriesForSitemap(subdomain),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/products?category=${category.slug}`,
    lastModified: new Date(category.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
