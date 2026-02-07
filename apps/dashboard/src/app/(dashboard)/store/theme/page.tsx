'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@baazarify/ui';

import { apiRequest } from '@/lib/api';
import { ThemeEditor } from '@/components/theme-editor/theme-editor';

interface ThemeData {
  preset?: string;
  tokens?: Record<string, unknown>;
  primaryColor?: string;
  accentColor?: string;
}

export default function ThemeEditorPage() {
  const [theme, setTheme] = useState<ThemeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ data: ThemeData }>('/stores/me/theme')
      .then((res) => setTheme(res.data))
      .catch(() => setTheme({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Theme Editor" description="Customize the look and feel of your storefront." />
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Theme Editor" description="Customize the look and feel of your storefront." />
      <ThemeEditor initialTheme={theme || undefined} />
    </div>
  );
}
