'use client';

import { useState, type FormEvent } from 'react';

import { apiRequest } from '@/lib/api';

interface StoreData {
  _id: string;
  name: string;
  subdomain: string;
  description?: string;
  logo?: string;
  favicon?: string;
  status: string;
  plan: string;
  settings: {
    currency: string;
    timezone: string;
    language: string;
    theme: {
      primaryColor: string;
      accentColor: string;
    };
  };
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}

interface Props {
  store: StoreData;
  onUpdate: (store: StoreData) => void;
}

export function StoreProfileForm({ store, onUpdate }: Props) {
  const [name, setName] = useState(store.name);
  const [description, setDescription] = useState(store.description || '');
  const [logo, setLogo] = useState(store.logo || '');
  const [favicon, setFavicon] = useState(store.favicon || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await apiRequest<{ success: boolean; data: StoreData }>('/stores/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          description,
          logo: logo || undefined,
          favicon: favicon || undefined,
        }),
      });
      onUpdate(response.data);
      setMessage('Store profile updated successfully');
    } catch {
      setError('Failed to update store profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-[var(--mist)]/20 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-[var(--charcoal)]">Store Profile</h3>
          <p className="text-sm text-[var(--slate)] mt-0.5">Basic information about your store</p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="store-name"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              Store Name
            </label>
            <input
              id="store-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full h-10 rounded-lg border border-[var(--mist)]/30 bg-white px-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all"
              placeholder="Your store name"
            />
          </div>

          <div>
            <label
              htmlFor="subdomain"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              Subdomain
            </label>
            <div className="flex items-center gap-0">
              <input
                id="subdomain"
                type="text"
                value={store.subdomain}
                disabled
                className="flex-1 h-10 rounded-l-lg border border-r-0 border-[var(--mist)]/30 bg-[var(--cream-dark)] px-3 text-sm text-[var(--slate)] cursor-not-allowed"
              />
              <span className="h-10 flex items-center px-3 bg-[var(--cream-dark)] border border-l-0 border-[var(--mist)]/30 rounded-r-lg text-sm text-[var(--slate)]">
                .baazarify.com
              </span>
            </div>
            <p className="text-xs text-[var(--stone)] mt-1">
              Subdomain cannot be changed after creation
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[var(--mist)]/30 bg-white px-3 py-2 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all resize-none"
              placeholder="Describe your store..."
            />
          </div>

          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              Logo URL
            </label>
            <input
              id="logo"
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--mist)]/30 bg-white px-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label
              htmlFor="favicon"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              Favicon URL
            </label>
            <input
              id="favicon"
              type="url"
              value={favicon}
              onChange={(e) => setFavicon(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--mist)]/30 bg-white px-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all"
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--cream-dark)] text-[var(--slate)]">
            Plan: <span className="capitalize">{store.plan}</span>
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              store.status === 'active'
                ? 'bg-green-50 text-green-700'
                : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            {store.status === 'active' ? 'Active' : store.status}
          </span>
        </div>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--charcoal)] rounded-lg hover:bg-[var(--charcoal-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
