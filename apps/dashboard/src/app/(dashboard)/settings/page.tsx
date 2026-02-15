'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  User,
  Store,
  Phone,
  Palette,
  Loader2,
  XCircle,
  Plug2,
  CreditCard,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { Switch, PageHeader } from '@baazarify/ui';

import { apiRequest } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';

// ─── Types ───────────────────────────────────────────────

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
    theme: { primaryColor: string; accentColor: string };
  };
  contact?: { email?: string; phone?: string; address?: string };
  social?: { facebook?: string; instagram?: string; tiktok?: string };
}

interface ProviderConfig {
  provider: string;
  enabled: boolean;
  testMode?: boolean;
  credentials?: Record<string, string>;
  connectedAt?: string;
}

interface IntegrationSettings {
  payments: ProviderConfig[];
  logistics: ProviderConfig[];
}

// ─── Section definitions ─────────────────────────────────

type SectionId = 'profile' | 'contact' | 'theme' | 'merchant' | 'integrations';

const SECTIONS: { id: SectionId; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'profile',
    label: 'Store Profile',
    icon: <Store size={18} />,
    description: 'Name, subdomain & branding',
  },
  {
    id: 'contact',
    label: 'Contact & Social',
    icon: <Phone size={18} />,
    description: 'How customers reach you',
  },
  {
    id: 'theme',
    label: 'Theme & Locale',
    icon: <Palette size={18} />,
    description: 'Colors, currency & language',
  },
  {
    id: 'merchant',
    label: 'Merchant Profile',
    icon: <User size={18} />,
    description: 'Your account details',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: <Plug2 size={18} />,
    description: 'Payments & logistics',
  },
];

// ─── Integration provider configs ────────────────────────

const PAYMENT_PROVIDERS = [
  {
    id: 'esewa',
    name: 'eSewa',
    description: "Nepal's leading digital wallet",
    fields: [
      { key: 'merchantCode', label: 'Merchant Code' },
      { key: 'secretKey', label: 'Secret Key', type: 'password' },
    ],
  },
  {
    id: 'khalti',
    name: 'Khalti',
    description: 'Digital wallet and payment gateway',
    fields: [
      { key: 'secretKey', label: 'Secret Key', type: 'password' },
      { key: 'publicKey', label: 'Public Key' },
    ],
  },
  {
    id: 'fonepay',
    name: 'Fonepay',
    description: 'QR-based payment via 64+ banking apps',
    fields: [
      { key: 'merchantCode', label: 'Merchant Code' },
      { key: 'secretKey', label: 'Secret Key', type: 'password' },
    ],
  },
];

const LOGISTICS_PROVIDERS: ((typeof PAYMENT_PROVIDERS)[number] & { comingSoon?: boolean })[] = [
  {
    id: 'pathao',
    name: 'Pathao',
    description: 'Last-mile delivery across Nepal',
    fields: [
      { key: 'clientId', label: 'Client ID' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password' },
      { key: 'username', label: 'Username' },
      { key: 'password', label: 'Password', type: 'password' },
    ],
  },
  {
    id: 'ncm',
    name: 'Nepal Can Move',
    description: 'Fast COD settlement (24h)',
    fields: [],
    comingSoon: true,
  },
  {
    id: 'dash',
    name: 'Dash Logistics',
    description: 'Half-kg pricing, warehousing',
    fields: [],
    comingSoon: true,
  },
];

// ─── Reusable pieces ─────────────────────────────────────

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

const inputCls =
  'w-full h-10 rounded-xl border border-[var(--grey-200)] bg-white px-3.5 text-sm text-[var(--grey-900)] placeholder:text-[var(--grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/20 focus:border-[var(--primary-main)] transition-all';
const disabledInputCls =
  'w-full h-10 rounded-xl border border-[var(--grey-200)] bg-[var(--grey-100)] px-3.5 text-sm text-[var(--grey-500)] cursor-not-allowed';
const labelCls = 'block text-[13px] font-semibold text-[var(--grey-700)] mb-1.5 tracking-wide';
const selectCls =
  'w-full h-10 rounded-xl border border-[var(--grey-200)] bg-white px-3 text-sm text-[var(--grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/20 focus:border-[var(--primary-main)] transition-all appearance-none cursor-pointer';

function SaveButton({ saving, disabled }: { saving: boolean; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving || disabled}
      className="btn-coral px-5 py-2.5 text-sm font-semibold text-white bg-[var(--primary-main)] rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-md hover:shadow-[var(--primary-main)]/20"
    >
      {saving ? (
        <span className="flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          Saving…
        </span>
      ) : (
        'Save Changes'
      )}
    </button>
  );
}

function FormMessage({
  message,
  error,
}: {
  message: string;
  error: string;
}) {
  if (!message && !error) return null;
  return (
    <>
      {message && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--success-lighter)] border border-[var(--success-light)]/30 text-sm text-[var(--success-dark)] animate-slide-up">
          <CheckCircle size={16} />
          {message}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 animate-slide-up">
          <XCircle size={16} />
          {error}
        </div>
      )}
    </>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bzr-card p-6 space-y-5">
      <div>
        <h3 className="text-[15px] font-bold text-[var(--grey-900)] tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--grey-500)] mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Provider card for integrations ──────────────────────

function ProviderCard({
  provider,
  config,
  type,
  onSave,
}: {
  provider: (typeof PAYMENT_PROVIDERS)[number] & { comingSoon?: boolean };
  config?: ProviderConfig;
  type: 'payments' | 'logistics';
  onSave: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [enabled, setEnabled] = useState(config?.enabled ?? false);
  const [testMode, setTestMode] = useState(config?.testMode ?? true);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const payload: Record<string, unknown> = { provider: provider.id, enabled };
      if (type === 'payments') payload.testMode = testMode;
      const hasCredentials = Object.values(credentials).some((v) => v.length > 0);
      if (hasCredentials) payload.credentials = credentials;
      await onSave(payload);
      setStatus('success');
      setCredentials({});
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (provider.comingSoon) {
    return (
      <div className="bzr-card p-5 opacity-50 pointer-events-none">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[var(--grey-900)]">{provider.name}</h4>
            <p className="text-xs text-[var(--grey-500)] mt-0.5">{provider.description}</p>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--grey-400)] bg-[var(--grey-100)] px-2.5 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bzr-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[var(--grey-900)]">{provider.name}</h4>
          <p className="text-xs text-[var(--grey-500)] mt-0.5">{provider.description}</p>
        </div>
        <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
      </div>

      {enabled && (
        <div className="mt-4 pt-4 border-t border-[var(--grey-200)] space-y-3 animate-slide-up">
          {type === 'payments' && (
            <label className="flex items-center gap-2.5 text-sm text-[var(--grey-600)] cursor-pointer">
              <input
                type="checkbox"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className="rounded-md border-[var(--grey-300)] text-[var(--primary-main)] focus:ring-[var(--primary-main)]/20"
              />
              Sandbox / Test mode
            </label>
          )}

          {provider.fields.map((field) => (
            <div key={field.key}>
              <label className={labelCls}>{field.label}</label>
              <input
                type={field.type || 'text'}
                value={credentials[field.key] || ''}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={config?.credentials?.[field.key] || `Enter ${field.label}`}
                className={inputCls}
              />
            </div>
          ))}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-coral px-4 py-2 text-sm font-semibold text-white bg-[var(--primary-main)] rounded-xl disabled:opacity-40 flex items-center gap-2 transition-all hover:shadow-md hover:shadow-[var(--primary-main)]/20"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
            {status === 'success' && (
              <span className="flex items-center gap-1.5 text-sm text-[var(--success-dark)] animate-slide-up">
                <CheckCircle size={14} /> Saved
              </span>
            )}
            {status === 'error' && (
              <span className="flex items-center gap-1.5 text-sm text-red-600 animate-slide-up">
                <XCircle size={14} /> Failed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section panels ──────────────────────────────────────

function ProfileSection({
  store,
  onUpdate,
}: {
  store: StoreData;
  onUpdate: (s: StoreData) => void;
}) {
  const [name, setName] = useState(store.name);
  const [description, setDescription] = useState(store.description || '');
  const [logo, setLogo] = useState(store.logo || '');
  const [favicon, setFavicon] = useState(store.favicon || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await apiRequest<{ success: boolean; data: StoreData }>('/stores/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          description,
          logo: logo || undefined,
          favicon: favicon || undefined,
        }),
      });
      onUpdate(res.data);
      setMessage('Store profile updated');
    } catch {
      setError('Failed to update store profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-rise">
      <SectionCard title="Store Identity" description="How your store appears to customers">
        <div className="space-y-4">
          <div>
            <label htmlFor="store-name" className={labelCls}>Store Name</label>
            <input
              id="store-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className={inputCls}
              placeholder="Your store name"
            />
          </div>
          <div>
            <label htmlFor="subdomain" className={labelCls}>Subdomain</label>
            <div className="flex items-center">
              <input
                id="subdomain"
                type="text"
                value={store.subdomain}
                disabled
                className="flex-1 h-10 rounded-l-xl border border-r-0 border-[var(--grey-200)] bg-[var(--grey-100)] px-3.5 text-sm text-[var(--grey-500)] cursor-not-allowed"
              />
              <span className="h-10 flex items-center px-3.5 bg-[var(--grey-100)] border border-l-0 border-[var(--grey-200)] rounded-r-xl text-sm text-[var(--grey-400)] font-mono">
                .baazarify.com
              </span>
            </div>
            <p className="text-[11px] text-[var(--grey-400)] mt-1.5 ml-0.5">
              Cannot be changed after creation
            </p>
          </div>
          <div>
            <label htmlFor="description" className={labelCls}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[var(--grey-200)] bg-white px-3.5 py-2.5 text-sm text-[var(--grey-900)] placeholder:text-[var(--grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/20 focus:border-[var(--primary-main)] transition-all resize-none"
              placeholder="Describe your store…"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Brand Assets" description="Logo and favicon for your store">
        <div className="space-y-4">
          <div>
            <label htmlFor="logo" className={labelCls}>Logo URL</label>
            <input
              id="logo"
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className={inputCls}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label htmlFor="favicon" className={labelCls}>Favicon URL</label>
            <input
              id="favicon"
              type="url"
              value={favicon}
              onChange={(e) => setFavicon(e.target.value)}
              className={inputCls}
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[var(--grey-100)] text-[var(--grey-500)]">
            Plan: {store.plan}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
              store.status === 'active'
                ? 'bg-[var(--success-lighter)] text-[var(--success-dark)]'
                : 'bg-[var(--warning-lighter)] text-[var(--warning-dark)]'
            }`}
          >
            {store.status}
          </span>
        </div>
      </SectionCard>

      <FormMessage message={message} error={error} />
      <div className="flex justify-end">
        <SaveButton saving={saving} disabled={!name.trim()} />
      </div>
    </form>
  );
}

function ContactSection({
  store,
  onUpdate,
}: {
  store: StoreData;
  onUpdate: (s: StoreData) => void;
}) {
  const [email, setEmail] = useState(store.contact?.email || '');
  const [phone, setPhone] = useState(store.contact?.phone || '');
  const [address, setAddress] = useState(store.contact?.address || '');
  const [facebook, setFacebook] = useState(store.social?.facebook || '');
  const [instagram, setInstagram] = useState(store.social?.instagram || '');
  const [tiktok, setTiktok] = useState(store.social?.tiktok || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await apiRequest<{ success: boolean; data: StoreData }>('/stores/me', {
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
      onUpdate(res.data);
      setMessage('Contact details updated');
    } catch {
      setError('Failed to update contact details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-rise">
      <SectionCard title="Contact Information" description="How customers can reach you">
        <div className="space-y-4">
          <div>
            <label htmlFor="contact-email" className={labelCls}>Email</label>
            <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="store@example.com" />
          </div>
          <div>
            <label htmlFor="contact-phone" className={labelCls}>Phone</label>
            <input id="contact-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+977-9800000000" />
          </div>
          <div>
            <label htmlFor="contact-address" className={labelCls}>Address</label>
            <textarea
              id="contact-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-[var(--grey-200)] bg-white px-3.5 py-2.5 text-sm text-[var(--grey-900)] placeholder:text-[var(--grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/20 focus:border-[var(--primary-main)] transition-all resize-none"
              placeholder="Kathmandu, Nepal"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Social Media" description="Connect your social presence">
        <div className="space-y-4">
          <div>
            <label htmlFor="social-fb" className={labelCls}>Facebook</label>
            <input id="social-fb" type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} className={inputCls} placeholder="https://facebook.com/yourstore" />
          </div>
          <div>
            <label htmlFor="social-ig" className={labelCls}>Instagram</label>
            <input id="social-ig" type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} className={inputCls} placeholder="https://instagram.com/yourstore" />
          </div>
          <div>
            <label htmlFor="social-tt" className={labelCls}>TikTok</label>
            <input id="social-tt" type="url" value={tiktok} onChange={(e) => setTiktok(e.target.value)} className={inputCls} placeholder="https://tiktok.com/@yourstore" />
          </div>
        </div>
      </SectionCard>

      <FormMessage message={message} error={error} />
      <div className="flex justify-end">
        <SaveButton saving={saving} />
      </div>
    </form>
  );
}

function ThemeSection({
  store,
  onUpdate,
}: {
  store: StoreData;
  onUpdate: (s: StoreData) => void;
}) {
  const [primaryColor, setPrimaryColor] = useState(store.settings.theme.primaryColor);
  const [accentColor, setAccentColor] = useState(store.settings.theme.accentColor);
  const [currency, setCurrency] = useState(store.settings.currency);
  const [timezone, setTimezone] = useState(store.settings.timezone);
  const [language, setLanguage] = useState(store.settings.language);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await apiRequest<{ success: boolean; data: StoreData }>(
        '/stores/me/settings',
        {
          method: 'PATCH',
          body: JSON.stringify({
            currency,
            timezone,
            language,
            theme: { primaryColor, accentColor },
          }),
        },
      );
      onUpdate(res.data);
      setMessage('Theme settings updated');
    } catch {
      setError('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-rise">
      <SectionCard title="Theme Colors" description="Customize your storefront appearance">
        <div className="space-y-6">
          {[
            { label: 'Primary Color', value: primaryColor, set: setPrimaryColor },
            { label: 'Accent Color', value: accentColor, set: setAccentColor },
          ].map((color) => (
            <div key={color.label}>
              <label className={labelCls}>{color.label}</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {presetColors.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => color.set(p.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      color.value === p.value
                        ? 'border-[var(--grey-900)] scale-110 shadow-md'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: p.value }}
                    title={p.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color.value}
                  onChange={(e) => color.set(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-[var(--grey-200)] cursor-pointer"
                />
                <input
                  type="text"
                  value={color.value}
                  onChange={(e) => color.set(e.target.value)}
                  className="w-28 h-10 rounded-xl border border-[var(--grey-200)] bg-white px-3 text-sm text-[var(--grey-900)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/20 focus:border-[var(--primary-main)] transition-all"
                />
              </div>
            </div>
          ))}

          <div>
            <p className="text-[13px] font-semibold text-[var(--grey-700)] mb-2">Preview</p>
            <div className="rounded-xl border border-[var(--grey-200)] p-4 bg-[var(--grey-50)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: primaryColor }} />
                <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: accentColor }} />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Store Preferences" description="Currency, timezone & language">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currency" className={labelCls}>Currency</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectCls}>
              {currencyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="timezone" className={labelCls}>Timezone</label>
            <select id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} className={selectCls}>
              {timezoneOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="language" className={labelCls}>Language</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className={selectCls}>
              {languageOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </SectionCard>

      <FormMessage message={message} error={error} />
      <div className="flex justify-end">
        <SaveButton saving={saving} />
      </div>
    </form>
  );
}

function MerchantSection() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="bzr-card p-6 text-center text-sm text-[var(--grey-500)] animate-rise">
        Unable to load profile information
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-rise">
      <SectionCard title="Account Information" description="Your merchant account details">
        <div className="space-y-4">
          {[
            { label: 'Name', value: user.name },
            { label: 'Email', value: user.email },
            { label: 'Phone', value: user.phone || '', placeholder: 'Not set' },
            {
              label: 'Role',
              value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
            },
          ].map((field) => (
            <div key={field.label}>
              <label className={labelCls}>{field.label}</label>
              <input
                type="text"
                value={field.value}
                disabled
                placeholder={field.placeholder}
                className={disabledInputCls}
              />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[var(--grey-400)]">
          Profile editing will be available in a future update.
        </p>
      </SectionCard>

      <SectionCard title="Account Status">
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
              user.emailVerified
                ? 'bg-[var(--success-lighter)] text-[var(--success-dark)]'
                : 'bg-[var(--warning-lighter)] text-[var(--warning-dark)]'
            }`}
          >
            {user.emailVerified ? 'Email Verified' : 'Email Not Verified'}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[var(--grey-100)] text-[var(--grey-500)]">
            {user.onboardingCompleted ? 'Onboarding Complete' : 'Onboarding Pending'}
          </span>
          {user.lastLoginAt && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[var(--grey-100)] text-[var(--grey-500)]">
              Last login:{' '}
              {new Date(user.lastLoginAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function IntegrationsSection() {
  const [settings, setSettings] = useState<IntegrationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<'payments' | 'logistics'>('payments');

  const fetchSettings = useCallback(async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: IntegrationSettings }>(
        '/integrations/settings',
      );
      setSettings(res.data);
    } catch {
      setSettings({ payments: [], logistics: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSavePayment = async (data: Record<string, unknown>) => {
    await apiRequest('/integrations/settings/payments', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    await fetchSettings();
  };

  const handleSaveLogistics = async (data: Record<string, unknown>) => {
    await apiRequest('/integrations/settings/logistics', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    await fetchSettings();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-rise">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skel h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-rise">
      {/* Sub-navigation pills */}
      <div className="flex gap-2 p-1 bg-[var(--grey-100)] rounded-xl w-fit">
        {[
          { id: 'payments' as const, label: 'Payments', icon: <CreditCard size={14} /> },
          { id: 'logistics' as const, label: 'Logistics', icon: <Truck size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              subTab === tab.id
                ? 'bg-white text-[var(--grey-900)] shadow-sm'
                : 'text-[var(--grey-500)] hover:text-[var(--grey-700)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'payments' && (
        <div className="space-y-3 animate-slide-up">
          <div className="bzr-card p-5 bg-[var(--grey-50)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--success-lighter)] flex items-center justify-center">
                <CheckCircle size={16} className="text-[var(--success-dark)]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--grey-900)]">Cash on Delivery</h4>
                <p className="text-xs text-[var(--grey-500)]">
                  Always enabled — customers pay on delivery
                </p>
              </div>
            </div>
          </div>
          {PAYMENT_PROVIDERS.map((p) => (
            <ProviderCard
              key={p.id}
              provider={p}
              config={settings?.payments.find((c) => c.provider === p.id)}
              type="payments"
              onSave={handleSavePayment}
            />
          ))}
        </div>
      )}

      {subTab === 'logistics' && (
        <div className="space-y-3 animate-slide-up">
          {LOGISTICS_PROVIDERS.map((p) => (
            <ProviderCard
              key={p.id}
              provider={p}
              config={settings?.logistics.find((c) => c.provider === p.id)}
              type="logistics"
              onSave={handleSaveLogistics}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main settings page ──────────────────────────────────

export default function SettingsPage() {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<SectionId>('profile');

  const fetchStore = async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: StoreData }>('/stores/me');
      setStore(res.data);
    } catch {
      setError('Failed to load store settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 skel mb-2" />
        <div className="h-5 w-72 skel mb-8" />
        <div className="flex gap-8">
          <div className="w-56 shrink-0 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="skel h-12" />)}
          </div>
          <div className="flex-1 skel h-96" />
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div>
        <div className="bzr-card p-8 text-center">
          <p className="text-red-600 mb-4">{error || 'Store not found'}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError('');
              fetchStore();
            }}
            className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-rise">
      <PageHeader title="Settings" description="Manage your store, integrations & preferences" />

      <div className="flex gap-8 mt-2">
        {/* ── Sidebar nav ── */}
        <nav className="w-56 shrink-0 space-y-1 sticky top-24 self-start">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-white shadow-sm border border-[var(--grey-200)] text-[var(--grey-900)]'
                    : 'text-[var(--grey-500)] hover:text-[var(--grey-700)] hover:bg-[var(--grey-100)]/60'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[var(--primary-lighter)] text-[var(--primary-main)]'
                      : 'bg-[var(--grey-100)] text-[var(--grey-400)] group-hover:text-[var(--grey-600)]'
                  }`}
                >
                  {section.icon}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-[var(--grey-900)]' : ''}`}>
                    {section.label}
                  </p>
                  <p className="text-[11px] text-[var(--grey-400)] truncate">{section.description}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* ── Content area ── */}
        <div className="flex-1 min-w-0 max-w-2xl pb-12">
          {activeSection === 'profile' && (
            <ProfileSection store={store} onUpdate={setStore} />
          )}
          {activeSection === 'contact' && (
            <ContactSection store={store} onUpdate={setStore} />
          )}
          {activeSection === 'theme' && (
            <ThemeSection store={store} onUpdate={setStore} />
          )}
          {activeSection === 'merchant' && <MerchantSection />}
          {activeSection === 'integrations' && <IntegrationsSection />}
        </div>
      </div>
    </div>
  );
}
