'use client';

import { PageHeader } from '@baazarify/ui';
import { useState, useEffect } from 'react';
import type { PageConfig } from '@baazarify/storefront-builder';

import { apiRequest } from '@/lib/api';
import { PageEditor } from '@/components/landing-page-editor/page-editor';

export default function LandingPageEditorPage() {
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ data: PageConfig | null }>('/stores/me/landing-page/draft')
      .then((res) => {
        if (res.data) {
          setPages([res.data]);
        }
      })
      .catch(() => setPages([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Landing Page Editor"
          description="Build your store landing page with drag-and-drop sections."
        />
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Landing Page Editor"
        description="Build your store landing page with drag-and-drop sections."
      />
      <PageEditor initialPages={pages.length > 0 ? pages : undefined} />
    </div>
  );
}
