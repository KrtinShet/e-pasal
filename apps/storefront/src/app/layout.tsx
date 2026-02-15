import './globals.css';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { getStoreBySubdomain } from '@/lib/api';
import { Header, Footer } from '@/components/layout';
import { getStoreBaseUrl, generateStoreMetadata } from '@/lib/seo';
import { WebSiteJsonLd, OrganizationJsonLd } from '@/components/seo';

import { Providers } from './providers';
import { StoreNotFound } from './store-not-found';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const subdomain = headersList.get('x-store-subdomain');

  if (!subdomain) {
    return {
      title: 'Baazarify Store',
      description: 'Your premier online shopping destination',
    };
  }

  try {
    const store = await getStoreBySubdomain(subdomain);
    if (store) {
      const baseMetadata = generateStoreMetadata({ store, subdomain });
      return {
        ...baseMetadata,
        icons: store.favicon ? { icon: store.favicon } : undefined,
      };
    }
  } catch {
    // Fall through to default
  }

  return {
    title: 'Store Not Found',
    description: 'The requested store could not be found',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const subdomain = headersList.get('x-store-subdomain');

  let store = null;
  let storeError = false;

  if (subdomain) {
    try {
      store = await getStoreBySubdomain(subdomain);
      if (!store) {
        storeError = true;
      }
    } catch {
      storeError = true;
    }
  }

  if (storeError) {
    return (
      <html lang="en">
        <body className="antialiased">
          <StoreNotFound />
        </body>
      </html>
    );
  }

  const storeUrl = store && subdomain ? getStoreBaseUrl(store, subdomain) : null;

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {store && storeUrl && (
          <>
            <OrganizationJsonLd store={store} url={storeUrl} />
            <WebSiteJsonLd store={store} url={storeUrl} />
          </>
        )}
      </head>
      <body className="antialiased">
        <Providers store={store}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--grey-900)] focus:text-[var(--grey-50)] focus:rounded-lg focus:outline-none"
          >
            Skip to main content
          </a>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
