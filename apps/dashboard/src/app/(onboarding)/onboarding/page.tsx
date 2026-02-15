import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';

export default function OnboardingPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--grey-900)]">Set up your store</h1>
        <p className="mt-2 text-[var(--grey-500)]">
          Let&apos;s get your online store ready in just a few steps.
        </p>
      </div>

      <div className="bg-[var(--grey-50)] rounded-[20px] border border-[var(--grey-200)] p-6 sm:p-8">
        <OnboardingWizard />
      </div>
    </div>
  );
}
