'use client';

import { Input } from '@baazarify/ui';

import type { OnboardingFormData } from '@/hooks/use-onboarding-form';

interface StepAppearanceProps {
  data: OnboardingFormData;
  updateField: <K extends keyof OnboardingFormData>(field: K, value: OnboardingFormData[K]) => void;
}

export function StepAppearance({ data, updateField }: StepAppearanceProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[var(--grey-900)] mb-1">Store appearance</h3>
        <p className="text-sm text-[var(--grey-500)]">
          Customize the look and feel of your store. You can change these later.
        </p>
      </div>

      <Input
        label="Logo URL (optional)"
        value={data.logo}
        onChange={(e) => updateField('logo', e.target.value)}
        placeholder="https://example.com/logo.png"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--grey-900)]">Primary color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={data.primaryColor}
              onChange={(e) => updateField('primaryColor', e.target.value)}
              className="w-10 h-10 rounded-[var(--radius-md)] border border-[var(--grey-200)] cursor-pointer"
            />
            <Input
              value={data.primaryColor}
              onChange={(e) => updateField('primaryColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--grey-900)]">Accent color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={data.accentColor}
              onChange={(e) => updateField('accentColor', e.target.value)}
              className="w-10 h-10 rounded-[var(--radius-md)] border border-[var(--grey-200)] cursor-pointer"
            />
            <Input
              value={data.accentColor}
              onChange={(e) => updateField('accentColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--grey-200)] bg-[white]">
        <p className="text-sm font-medium text-[var(--grey-500)] mb-3">Preview</p>
        <div className="flex gap-3">
          <div
            className="w-16 h-16 rounded-[var(--radius-md)]"
            style={{ backgroundColor: data.primaryColor }}
          />
          <div
            className="w-16 h-16 rounded-[var(--radius-md)]"
            style={{ backgroundColor: data.accentColor }}
          />
        </div>
      </div>
    </div>
  );
}
