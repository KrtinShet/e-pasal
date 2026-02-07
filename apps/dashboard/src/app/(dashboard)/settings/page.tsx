'use client';

import { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel, TabPanels, PageHeader } from '@baazarify/ui';

import { apiRequest } from '@/lib/api';
import { ThemeSettings } from '@/components/settings/theme-settings';
import { StoreProfileForm } from '@/components/settings/store-profile-form';
import { ContactSocialForm } from '@/components/settings/contact-social-form';
import { MerchantProfileInfo } from '@/components/settings/merchant-profile-info';

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

export default function SettingsPage() {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStore = async () => {
    try {
      const response = await apiRequest<{ success: boolean; data: StoreData }>('/stores/me');
      setStore(response.data);
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
        <div className="mb-8">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded-lg animate-pulse" />
          <div className="h-5 w-72 bg-[var(--color-surface)] rounded-lg animate-pulse mt-2" />
        </div>
        <div className="h-12 w-full bg-[var(--color-surface)] rounded-lg animate-pulse" />
        <div className="h-96 w-full bg-[var(--color-surface)] rounded-lg animate-pulse mt-6" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error || 'Store not found'}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError('');
              fetchStore();
            }}
            className="mt-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your store profile, contact details, and theme" />

      <Tabs defaultValue="profile">
        <TabList className="border-b border-[var(--color-border)]/20 gap-0">
          <Tab
            value="profile"
            className="text-[var(--color-text-secondary)] data-[state=active]:text-[var(--color-text-primary)] px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] -mb-px transition-colors hover:text-[var(--color-text-primary)]"
          >
            Store Profile
          </Tab>
          <Tab
            value="contact"
            className="text-[var(--color-text-secondary)] data-[state=active]:text-[var(--color-text-primary)] px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] -mb-px transition-colors hover:text-[var(--color-text-primary)]"
          >
            Contact & Social
          </Tab>
          <Tab
            value="theme"
            className="text-[var(--color-text-secondary)] data-[state=active]:text-[var(--color-text-primary)] px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] -mb-px transition-colors hover:text-[var(--color-text-primary)]"
          >
            Theme
          </Tab>
          <Tab
            value="merchant"
            className="text-[var(--color-text-secondary)] data-[state=active]:text-[var(--color-text-primary)] px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-[var(--color-primary)] -mb-px transition-colors hover:text-[var(--color-text-primary)]"
          >
            Merchant Profile
          </Tab>
        </TabList>

        <TabPanels className="mt-6">
          <TabPanel value="profile">
            <StoreProfileForm store={store} onUpdate={setStore} />
          </TabPanel>
          <TabPanel value="contact">
            <ContactSocialForm store={store} onUpdate={setStore} />
          </TabPanel>
          <TabPanel value="theme">
            <ThemeSettings store={store} onUpdate={setStore} />
          </TabPanel>
          <TabPanel value="merchant">
            <MerchantProfileInfo />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
