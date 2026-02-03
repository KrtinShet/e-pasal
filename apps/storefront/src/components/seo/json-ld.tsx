import type { StoreData } from '@/types/store';
import type { Product, Category } from '@/types/product';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

interface ProductJsonLdProps {
  product: Product;
  store: StoreData;
  url: string;
}

export function ProductJsonLd({ product, store, url }: ProductJsonLdProps) {
  const currency = store.settings?.currency || 'NPR';
  const availability =
    product.stock > 0 || product.allowBackorder
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images,
    sku: product.sku,
    url,
    brand: {
      '@type': 'Brand',
      name: store.name,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: product.price,
      availability,
      seller: {
        '@type': 'Organization',
        name: store.name,
      },
      ...(product.compareAtPrice && product.compareAtPrice > product.price
        ? {
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
          }
        : {}),
    },
  };

  return <JsonLd data={data} />;
}

interface OrganizationJsonLdProps {
  store: StoreData;
  url: string;
}

export function OrganizationJsonLd({ store, url }: OrganizationJsonLdProps) {
  const socialProfiles: string[] = [];
  if (store.social?.facebook) socialProfiles.push(store.social.facebook);
  if (store.social?.instagram) socialProfiles.push(store.social.instagram);
  if (store.social?.tiktok) socialProfiles.push(store.social.tiktok);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: store.name,
    url,
    ...(store.logo && { logo: store.logo }),
    ...(store.description && { description: store.description }),
    ...(store.contact?.email && { email: store.contact.email }),
    ...(store.contact?.phone && { telephone: store.contact.phone }),
    ...(store.contact?.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: store.contact.address,
      },
    }),
    ...(socialProfiles.length > 0 && { sameAs: socialProfiles }),
  };

  return <JsonLd data={data} />;
}

interface WebSiteJsonLdProps {
  store: StoreData;
  url: string;
}

export function WebSiteJsonLd({ store, url }: WebSiteJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: store.name,
    url,
    ...(store.description && { description: store.description }),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={data} />;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

interface ItemListJsonLdProps {
  name: string;
  description?: string;
  products: Array<{ name: string; url: string; image?: string; price?: number }>;
  url: string;
}

export function ItemListJsonLd({ name, description, products, url }: ItemListJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description && { description }),
    url,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        url: product.url,
        ...(product.image && { image: product.image }),
        ...(product.price && {
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'NPR',
          },
        }),
      },
    })),
  };

  return <JsonLd data={data} />;
}

interface CollectionPageJsonLdProps {
  store: StoreData;
  category?: Category;
  url: string;
  productCount: number;
}

export function CollectionPageJsonLd({
  store,
  category,
  url,
  productCount,
}: CollectionPageJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category?.name || 'All Products',
    ...(category?.description && { description: category.description }),
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: store.name,
    },
    numberOfItems: productCount,
  };

  return <JsonLd data={data} />;
}
