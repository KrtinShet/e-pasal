'use client';

import { useState } from 'react';
import type { PageConfig } from '@baazarify/storefront-builder';

import { apiRequest } from '@/lib/api';

interface AIGenerateModalProps {
  open: boolean;
  onClose: () => void;
  onGenerated: (config: PageConfig) => void;
}

const businessTypes = [
  'Clothing & Fashion',
  'Electronics & Gadgets',
  'Food & Groceries',
  'Beauty & Cosmetics',
  'Home & Furniture',
  'Books & Stationery',
  'Sports & Outdoor',
  'Health & Wellness',
  'Handmade & Crafts',
  'General Store',
];

const toneOptions = [
  'Professional and trustworthy',
  'Fun and playful',
  'Minimal and elegant',
  'Bold and energetic',
  'Warm and friendly',
];

export function AIGenerateModal({ open, onClose, onGenerated }: AIGenerateModalProps) {
  const [businessType, setBusinessType] = useState('');
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [tone, setTone] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleGenerate = async () => {
    const type = businessType === 'custom' ? customBusinessType : businessType;
    if (!type) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest<{ data: PageConfig }>('/stores/me/landing-page/generate', {
        method: 'POST',
        body: JSON.stringify({
          businessType: type,
          tone: tone || undefined,
          targetAudience: targetAudience || undefined,
        }),
      });

      onGenerated(response.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to generate landing page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Generate with AI</h2>
            <p className="text-sm text-gray-500">
              Describe your business and we will create a landing page for you.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Business Type <span className="text-red-500">*</span>
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select a business type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
              <option value="custom">Other (specify)</option>
            </select>
            {businessType === 'custom' && (
              <input
                type="text"
                value={customBusinessType}
                onChange={(e) => setCustomBusinessType(e.target.value)}
                placeholder="Describe your business type"
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tone (optional)</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Auto-detect</option>
              {toneOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Target Audience (optional)
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Young professionals in Kathmandu"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={
              loading || !businessType || (businessType === 'custom' && !customBusinessType)
            }
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Page'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
