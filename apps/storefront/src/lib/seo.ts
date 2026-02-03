import type { Metadata } from 'next';

import type { StoreData } from '@/types/store';
import type { Product } from '@/types/product';

const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'baazarify.com';

export function getStoreBaseUrl(store: StoreData | null, subdomain: string | null): string {
  if (store?.customDomain) {
    return `https://${store.customDomain}`;
  }

  if (subdomain) {
    return `https://${subdomain}.${DEFAULT_DOMAIN}`;
  }

  return `https://${DEFAULT_DOMAIN}`;
}

export function getCanonicalUrl(
  store: StoreData | null,
  subdomain: string | null,
  path: string = ''
): string {
  const baseUrl = getStoreBaseUrl(store, subdomain);
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function isIndexableEnvironment(): boolean {
  const env = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;

  if (env === 'development') return false;
  if (vercelEnv === 'preview') return false;

  return true;
}

interface BaseMetadataOptions {
  title: string;
  description: string;
  store: StoreData | null;
  subdomain: string | null;
  path?: string;
  noIndex?: boolean;
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
}

export function generateBaseMetadata({
  title,
  description,
  store,
  subdomain,
  path = '',
  noIndex = false,
  images,
}: BaseMetadataOptions): Metadata {
  const canonicalUrl = getCanonicalUrl(store, subdomain, path);
  const siteName = store?.name || 'Baazarify Store';
  const shouldNoIndex = noIndex || !isIndexableEnvironment();

  return {
    title,
    description,
    metadataBase: new URL(getStoreBaseUrl(store, subdomain)),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      type: 'website',
      ...(images && images.length > 0 && { images }),
    },
    twitter: {
      card: images && images.length > 0 ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(images && images.length > 0 && { images: images.map((img) => img.url) }),
    },
    robots: shouldNoIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
  };
}

interface ProductMetadataOptions {
  product: Product;
  store: StoreData | null;
  subdomain: string | null;
}

export function generateProductMetadata({
  product,
  store,
  subdomain,
}: ProductMetadataOptions): Metadata {
  const title = product.seo?.title || `${product.name} | ${store?.name || 'Shop'}`;
  const description =
    product.seo?.description ||
    product.shortDescription ||
    product.description ||
    `Buy ${product.name} at ${store?.name || 'our store'}`;

  const images =
    product.images && product.images.length > 0
      ? product.images.map((url) => ({
          url,
          alt: product.name,
        }))
      : undefined;

  const currency = store?.settings?.currency || 'NPR';

  return {
    ...generateBaseMetadata({
      title,
      description,
      store,
      subdomain,
      path: `/products/${product.slug}`,
      images,
    }),
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': currency,
      'product:availability':
        product.stock > 0 || product.allowBackorder ? 'in stock' : 'out of stock',
      ...(product.sku && { 'product:retailer_item_id': product.sku }),
    },
  };
}

interface StoreMetadataOptions {
  store: StoreData | null;
  subdomain: string | null;
}

export function generateStoreMetadata({ store, subdomain }: StoreMetadataOptions): Metadata {
  const title = store?.name || 'Baazarify Store';
  const description =
    store?.description || `Shop at ${title} - Your premier online shopping destination`;

  const images = store?.logo
    ? [
        {
          url: store.logo,
          alt: title,
        },
      ]
    : undefined;

  return generateBaseMetadata({
    title,
    description,
    store,
    subdomain,
    path: '/',
    images,
  });
}

interface ProductsPageMetadataOptions {
  store: StoreData | null;
  subdomain: string | null;
  categoryName?: string;
  searchQuery?: string;
}

export function generateProductsPageMetadata({
  store,
  subdomain,
  categoryName,
  searchQuery,
}: ProductsPageMetadataOptions): Metadata {
  let title = 'Products';
  let description = 'Browse our collection of products';
  let path = '/products';

  if (categoryName) {
    title = `${categoryName} | Products`;
    description = `Browse ${categoryName} products`;
    path = `/products?category=${encodeURIComponent(categoryName)}`;
  }

  if (searchQuery) {
    title = `Search results for "${searchQuery}"`;
    description = `Search results for "${searchQuery}" in our product catalog`;
    path = `/products?search=${encodeURIComponent(searchQuery)}`;
  }

  if (store?.name) {
    title = `${title} | ${store.name}`;
    description = `${description} at ${store.name}`;
  }

  return generateBaseMetadata({
    title,
    description,
    store,
    subdomain,
    path,
  });
}

export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > maxLength / 2 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}
