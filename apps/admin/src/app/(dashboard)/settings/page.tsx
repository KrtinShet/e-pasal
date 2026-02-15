import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="animate-rise p-8">
      <div className="accent-bar mb-8">
        <h1 className="font-display text-3xl font-bold text-[var(--grey-900)]">
          Platform Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--grey-400)]">Configure global platform options</p>
      </div>

      <div className="bzr-card animate-rise delay-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--warning-lighter)]">
          <Settings className="h-8 w-8 text-[var(--warning-dark)]" />
        </div>
        <h2 className="font-display text-xl font-semibold text-[var(--grey-900)]">
          Platform Settings
        </h2>
        <p className="mt-2 max-w-sm text-sm text-[var(--grey-400)]">
          Global configuration, feature flags, and platform-wide settings. Configuration tools are
          coming soon.
        </p>
      </div>
    </div>
  );
}
