'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'baazarify_onboarding';

export interface OnboardingFormData {
  storeName: string;
  subdomain: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
}

const defaultData: OnboardingFormData = {
  storeName: '',
  subdomain: '',
  description: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  logo: '',
  primaryColor: '#2563eb',
  accentColor: '#f59e0b',
};

export function useOnboardingForm() {
  const [data, setData] = useState<OnboardingFormData>(defaultData);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData({ ...defaultData, ...JSON.parse(saved) });
      }
    } catch {
      // ignore
    }
  }, []);

  const updateField = useCallback(
    <K extends keyof OnboardingFormData>(field: K, value: OnboardingFormData[K]) => {
      setData((prev) => {
        const next = { ...prev, [field]: value };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const clearSaved = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { data, updateField, clearSaved };
}
