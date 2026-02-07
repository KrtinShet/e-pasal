'use client';

import { useState, useEffect } from 'react';
import type { PageConfig } from '@baazarify/storefront-builder';

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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Landing Page Editor</h1>
          <p className="mt-1 text-gray-500">
            Build your store landing page with drag-and-drop sections.
          </p>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Landing Page Editor</h1>
        <p className="mt-1 text-gray-500">
          Build your store landing page with drag-and-drop sections.
        </p>
      </div>
      <PageEditor initialConfig={config} />
    </div>
  );
}
