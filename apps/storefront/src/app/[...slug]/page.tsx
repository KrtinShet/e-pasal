import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { LandingPagesConfig } from '@baazarify/storefront-builder';

import { getStoreBySubdomain } from '@/lib/api';

import { SlugPageRenderer } from './slug-page-renderer';

interface CatchAllPageProps {
  params: Promise<{ slug: string[] }>;
}

function normalizePath(path: string) {
  if (path === '/') return '/';
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.replace(/\/+$/, '') || '/';
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params;

  const headersList = await headers();
  const subdomain = headersList.get('x-store-subdomain');

  if (!subdomain) {
    notFound();
  }

  const store = await getStoreBySubdomain(subdomain);
  if (!store) {
    notFound();
  }

  const landingConfig = store.landingPage?.config as LandingPagesConfig | undefined;
  if (!landingConfig?.pages?.length) {
    notFound();
  }

  const currentPath = normalizePath(`/${slug.join('/')}`);
  const page = landingConfig.pages.find(
    (candidate) => normalizePath(candidate.slug) === currentPath
  );

  if (!page) {
    notFound();
  }

  return <SlugPageRenderer page={page} />;
}
