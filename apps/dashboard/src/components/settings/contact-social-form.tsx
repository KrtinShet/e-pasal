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

export function ContactSocialForm({ store, onUpdate }: Props) {
  const [email, setEmail] = useState(store.contact?.email || '');
  const [phone, setPhone] = useState(store.contact?.phone || '');
  const [address, setAddress] = useState(store.contact?.address || '');
  const [facebook, setFacebook] = useState(store.social?.facebook || '');
  const [instagram, setInstagram] = useState(store.social?.instagram || '');
  const [tiktok, setTiktok] = useState(store.social?.tiktok || '');
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
          contact: {
            email: email || undefined,
            phone: phone || undefined,
            address: address || undefined,
          },
          social: {
            facebook: facebook || undefined,
            instagram: instagram || undefined,
            tiktok: tiktok || undefined,
          },
        }),
      });
      onUpdate(response.data);
      setMessage('Contact details updated successfully');
    } catch {
      setError('Failed to update contact details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-[var(--ivory)] rounded-xl border border-[var(--mist)]/20 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-[var(--charcoal)]">Contact Information</h3>
          <p className="text-sm text-[var(--slate)] mt-0.5">How customers can reach you</p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--mist)]/30 bg-[var(--ivory)] px-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all"
              placeholder="store@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="contact-phone"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              Phone
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--mist)]/30 bg-[var(--ivory)] px-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all"
              placeholder="+977-9800000000"
            />
          </div>

          <div>
            <label
              htmlFor="contact-address"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              Address
            </label>
            <textarea
              id="contact-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-[var(--mist)]/30 bg-[var(--ivory)] px-3 py-2 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all resize-none"
              placeholder="Kathmandu, Nepal"
            />
          </div>
        </div>
      </div>

      <div className="bg-[var(--ivory)] rounded-xl border border-[var(--mist)]/20 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-[var(--charcoal)]">Social Media</h3>
          <p className="text-sm text-[var(--slate)] mt-0.5">Connect your social media accounts</p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="social-facebook"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              Facebook
            </label>
            <input
              id="social-facebook"
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--mist)]/30 bg-[var(--ivory)] px-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all"
              placeholder="https://facebook.com/yourstore"
            />
          </div>

          <div>
            <label
              htmlFor="social-instagram"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              Instagram
            </label>
            <input
              id="social-instagram"
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--mist)]/30 bg-[var(--ivory)] px-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all"
              placeholder="https://instagram.com/yourstore"
            />
          </div>

          <div>
            <label
              htmlFor="social-tiktok"
              className="block text-sm font-medium text-[var(--charcoal)] mb-1.5"
            >
              TikTok
            </label>
            <input
              id="social-tiktok"
              type="url"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--mist)]/30 bg-[var(--ivory)] px-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all"
              placeholder="https://tiktok.com/@yourstore"
            />
          </div>
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
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--charcoal)] rounded-lg hover:bg-[var(--charcoal-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
