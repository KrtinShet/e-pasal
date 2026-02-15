'use client';

import { useState } from 'react';
import { Button, Progress } from '@baazarify/ui';

import { useAuth } from '@/contexts/auth-context';
import { completeOnboardingApi } from '@/lib/auth-api';
import { useOnboardingForm } from '@/hooks/use-onboarding-form';

import { StepComplete } from './step-complete';
import { StepAppearance } from './step-appearance';
import { StepStoreBasics } from './step-store-basics';
import { StepBusinessInfo } from './step-business-info';

const STEPS = ['Store basics', 'Business info', 'Appearance', 'Complete'];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdSubdomain, setCreatedSubdomain] = useState('');
  const { data, updateField, clearSaved } = useOnboardingForm();
  const { refreshUser } = useAuth();

  const isStoreBasicsValid = data.storeName.trim().length >= 2 && data.subdomain.trim().length >= 3;

  async function handleComplete() {
    setError('');
    setLoading(true);

    try {
      const result = await completeOnboardingApi({
        storeName: data.storeName,
        subdomain: data.subdomain,
        description: data.description || undefined,
        contact:
          data.contactEmail || data.contactPhone || data.contactAddress
            ? {
                email: data.contactEmail || undefined,
                phone: data.contactPhone || undefined,
                address: data.contactAddress || undefined,
              }
            : undefined,
        logo: data.logo || undefined,
        theme: {
          primaryColor: data.primaryColor,
          accentColor: data.accentColor,
        },
      });

      setCreatedSubdomain(result.store.subdomain);
      clearSaved();
      await refreshUser();
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create store');
    } finally {
      setLoading(false);
    }
  }

  const progress = step < 3 ? ((step + 1) / 3) * 100 : 100;

  return (
    <div className="space-y-8">
      {step < 3 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--grey-900)]">
              Step {step + 1} of 3: {STEPS[step]}
            </h2>
            <span className="text-sm text-[var(--grey-400)]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} size="sm" />
        </div>
      )}

      {error && (
        <div className="p-3 rounded-[var(--radius-md)] bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {step === 0 && <StepStoreBasics data={data} updateField={updateField} />}
      {step === 1 && <StepBusinessInfo data={data} updateField={updateField} />}
      {step === 2 && <StepAppearance data={data} updateField={updateField} />}
      {step === 3 && <StepComplete subdomain={createdSubdomain} />}

      {step < 3 && (
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
            Back
          </Button>
          <div className="flex gap-3">
            {step === 1 || step === 2 ? (
              <Button variant="ghost" onClick={() => setStep((s) => s + 1)}>
                Skip
              </Button>
            ) : null}
            {step < 2 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 && !isStoreBasicsValid}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete} loading={loading} disabled={!isStoreBasicsValid}>
                Create store
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
