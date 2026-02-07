'use client';

import { useState, useEffect } from 'react';

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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Theme Editor</h1>
          <p className="mt-1 text-gray-500">Customize the look and feel of your storefront.</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Theme Editor</h1>
        <p className="mt-1 text-gray-500">Customize the look and feel of your storefront.</p>
      </div>
      <ThemeEditor initialTheme={theme || undefined} />
    </div>
  );
}
