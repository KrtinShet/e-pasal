'use client';

import { useState, useEffect } from 'react';
import type { PageConfig, LandingPagesConfig } from '@baazarify/storefront-builder';

import { apiRequest } from '@/lib/api';
import { PageEditor } from '@/components/landing-page-editor/page-editor';

export default function LandingPageEditorPage() {
  const [config, setConfig] = useState<LandingPagesConfig | undefined>(undefined);
  const [publishedPageIds, setPublishedPageIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest<{ data: LandingPagesConfig | PageConfig | null }>('/stores/me/landing-page/draft'),
      apiRequest<{ data: { landingPage?: { config?: LandingPagesConfig | PageConfig | null } } }>(
        '/stores/me'
      ),
    ])
      .then(([draftRes, storeRes]) => {
        const draft = draftRes.data;
        if (draft) {
          if ('version' in draft && draft.version === 2 && Array.isArray(draft.pages)) {
            setConfig(draft);
          } else {
            setConfig({
              version: 2,
              pages: [draft as PageConfig],
              homePageId: (draft as PageConfig).id,
            });
          }
        }

        const published = storeRes.data.landingPage?.config;
        if (published && typeof published === 'object') {
          if ('version' in (published as LandingPagesConfig)) {
            setPublishedPageIds(
              (published as LandingPagesConfig).pages?.map((page) => page.id) || []
            );
          } else if ('id' in (published as PageConfig)) {
            setPublishedPageIds([(published as PageConfig).id]);
          }
        }
      })
      .catch(() => {
        setConfig(undefined);
        setPublishedPageIds([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  return <PageEditor initialConfig={config} initialPublishedPageIds={publishedPageIds} />;
}
