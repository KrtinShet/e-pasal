'use client';

import { useState, useEffect } from 'react';
import type { PageConfig } from '@baazarify/storefront-builder';
import { PageHeader } from '@baazarify/ui';

import { apiRequest } from '@/lib/api';
import { PageEditor } from '@/components/landing-page-editor/page-editor';

export default function LandingPageEditorPage() {
  const [config, setConfig] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ data: PageConfig | null }>('/stores/me/landing-page/draft')
      .then((res) => setConfig(res.data))
      .catch(() => setConfig(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Landing Page Editor" description="Build your store landing page with drag-and-drop sections." />
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Landing Page Editor" description="Build your store landing page with drag-and-drop sections." />
      <PageEditor initialConfig={config} />
    </div>
  );
}
