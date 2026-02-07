'use client';

import { Input } from '@baazarify/ui';
import { useState, useEffect, useCallback } from 'react';

import { checkSubdomainApi } from '@/lib/auth-api';
import type { OnboardingFormData } from '@/hooks/use-onboarding-form';

interface StepStoreBasicsProps {
  data: OnboardingFormData;
  updateField: <K extends keyof OnboardingFormData>(field: K, value: OnboardingFormData[K]) => void;
}

export function StepStoreBasics({ data, updateField }: StepStoreBasicsProps) {
  const [subdomainStatus, setSubdomainStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');

  const checkSubdomain = useCallback(async (subdomain: string) => {
    if (subdomain.length < 3) {
      setSubdomainStatus('idle');
      return;
    }

    setSubdomainStatus('checking');
    try {
      const available = await checkSubdomainApi(subdomain);
      setSubdomainStatus(available ? 'available' : 'taken');
    } catch {
      setSubdomainStatus('idle');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.subdomain.length >= 3) {
        checkSubdomain(data.subdomain);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [data.subdomain, checkSubdomain]);

  function handleStoreNameChange(value: string) {
    updateField('storeName', value);
    if (!data.subdomain || data.subdomain === toSubdomain(data.storeName)) {
      updateField('subdomain', toSubdomain(value));
    }
  }

  const subdomainHelper =
    subdomainStatus === 'checking'
      ? 'Checking availability...'
      : subdomainStatus === 'available'
        ? `${data.subdomain}.localhost is available`
        : subdomainStatus === 'taken'
          ? undefined
          : data.subdomain.length >= 3
            ? `Your store will be at ${data.subdomain}.localhost`
            : 'Min. 3 characters, lowercase letters, numbers, and hyphens';

  const subdomainError =
    subdomainStatus === 'taken' ? 'This subdomain is already taken' : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
          Name your store
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Choose a name and URL for your online store.
        </p>
      </div>

      <Input
        label="Store name"
        value={data.storeName}
        onChange={(e) => handleStoreNameChange(e.target.value)}
        placeholder="My Amazing Store"
        required
      />

      <Input
        label="Store URL"
        value={data.subdomain}
        onChange={(e) =>
          updateField('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
        }
        placeholder="my-store"
        helperText={subdomainHelper}
        error={subdomainError}
        required
      />

      <Input
        label="Description (optional)"
        value={data.description}
        onChange={(e) => updateField('description', e.target.value)}
        placeholder="A brief description of your store"
      />
    </div>
  );
}

function toSubdomain(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30);
}
