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

const presetColors = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Coral', value: '#e8654a' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Indigo', value: '#4f46e5' },
];

const currencyOptions = [
  { value: 'NPR', label: 'NPR - Nepali Rupee' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'INR', label: 'INR - Indian Rupee' },
];

const timezoneOptions = [
  { value: 'Asia/Kathmandu', label: 'Asia/Kathmandu (NPT +05:45)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST +05:30)' },
  { value: 'UTC', label: 'UTC' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ne', label: 'Nepali' },
];

export function ThemeSettings({ store, onUpdate }: Props) {
  const [primaryColor, setPrimaryColor] = useState(store.settings.theme.primaryColor);
  const [accentColor, setAccentColor] = useState(store.settings.theme.accentColor);
  const [currency, setCurrency] = useState(store.settings.currency);
  const [timezone, setTimezone] = useState(store.settings.timezone);
  const [language, setLanguage] = useState(store.settings.language);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await apiRequest<{ success: boolean; data: StoreData }>(
        '/stores/me/settings',
        {
          method: 'PATCH',
          body: JSON.stringify({
            currency,
            timezone,
            language,
            theme: { primaryColor, accentColor },
          }),
        }
      );
      onUpdate(response.data);
      setMessage('Settings updated successfully');
    } catch {
      setError('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-[white] rounded-xl border border-[var(--grey-200)]/20 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-[var(--grey-900)]">Theme Colors</h3>
          <p className="text-sm text-[var(--grey-600)] mt-0.5">
            Customize your storefront appearance
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--grey-900)] mb-3">
              Primary Color
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presetColors.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setPrimaryColor(preset.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    primaryColor === preset.value
                      ? 'border-[var(--grey-900)] scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-[var(--grey-200)]/30 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-28 h-10 rounded-lg border border-[var(--grey-200)]/30 bg-[white] px-3 text-sm text-[var(--grey-900)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/30 focus:border-[var(--primary-main)] transition-all"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--grey-900)] mb-3">
              Accent Color
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presetColors.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setAccentColor(preset.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    accentColor === preset.value
                      ? 'border-[var(--grey-900)] scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-[var(--grey-200)]/30 cursor-pointer"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-28 h-10 rounded-lg border border-[var(--grey-200)]/30 bg-[white] px-3 text-sm text-[var(--grey-900)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/30 focus:border-[var(--primary-main)] transition-all"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm font-medium text-[var(--grey-900)] mb-3">Preview</p>
            <div className="rounded-lg border border-[var(--grey-200)]/20 p-4 bg-[var(--grey-50)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: primaryColor }} />
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: accentColor }} />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-medium text-white rounded-lg transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-medium text-white rounded-lg transition-colors"
                  style={{ backgroundColor: accentColor }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[white] rounded-xl border border-[var(--grey-200)]/20 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-[var(--grey-900)]">Store Preferences</h3>
          <p className="text-sm text-[var(--grey-600)] mt-0.5">
            Currency, timezone, and language settings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-[var(--grey-900)] mb-1.5"
            >
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--grey-200)]/30 bg-[white] px-3 text-sm text-[var(--grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/30 focus:border-[var(--primary-main)] transition-all appearance-none cursor-pointer"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-[var(--grey-900)] mb-1.5"
            >
              Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--grey-200)]/30 bg-[white] px-3 text-sm text-[var(--grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/30 focus:border-[var(--primary-main)] transition-all appearance-none cursor-pointer"
            >
              {timezoneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-[var(--grey-900)] mb-1.5"
            >
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--grey-200)]/30 bg-[white] px-3 text-sm text-[var(--grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/30 focus:border-[var(--primary-main)] transition-all appearance-none cursor-pointer"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
          className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--grey-900)] rounded-lg hover:bg-[var(--grey-800)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
