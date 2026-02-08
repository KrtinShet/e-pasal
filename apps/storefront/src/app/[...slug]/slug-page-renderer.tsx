'use client';

import { PageRenderer, type PageConfig } from '@baazarify/storefront-builder';

interface SlugPageRendererProps {
  page: PageConfig;
}

export function SlugPageRenderer({ page }: SlugPageRendererProps) {
  return <PageRenderer config={page} />;
}
