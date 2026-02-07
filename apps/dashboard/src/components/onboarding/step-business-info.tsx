'use client';

import { Input } from '@baazarify/ui';

import type { OnboardingFormData } from '@/hooks/use-onboarding-form';

interface StepBusinessInfoProps {
  data: OnboardingFormData;
  updateField: <K extends keyof OnboardingFormData>(field: K, value: OnboardingFormData[K]) => void;
}

export function StepBusinessInfo({ data, updateField }: StepBusinessInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
          Business information
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Add your contact details so customers can reach you. You can skip this for now.
        </p>
      </div>

      <Input
        label="Business email"
        type="email"
        value={data.contactEmail}
        onChange={(e) => updateField('contactEmail', e.target.value)}
        placeholder="hello@mystore.com"
      />

      <Input
        label="Phone number"
        type="tel"
        value={data.contactPhone}
        onChange={(e) => updateField('contactPhone', e.target.value)}
        placeholder="+977 98XXXXXXXX"
      />

      <Input
        label="Address"
        value={data.contactAddress}
        onChange={(e) => updateField('contactAddress', e.target.value)}
        placeholder="Kathmandu, Nepal"
      />
    </div>
  );
}
