'use client';

import { useAuth } from '@/contexts/auth-context';

export function MerchantProfileInfo() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-2xl">
        <div className="bg-[white] rounded-xl border border-[var(--grey-200)]/20 p-6 text-center text-sm text-[var(--grey-600)]">
          Unable to load profile information
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[white] rounded-xl border border-[var(--grey-200)]/20 p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-[var(--grey-900)]">Merchant Profile</h3>
          <p className="text-sm text-[var(--grey-600)] mt-0.5">Your account information</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--grey-900)] mb-1.5">Name</label>
            <input
              type="text"
              value={user.name}
              disabled
              className="w-full h-10 rounded-lg border border-[var(--grey-200)]/30 bg-[var(--grey-100)] px-3 text-sm text-[var(--grey-600)] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--grey-900)] mb-1.5">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full h-10 rounded-lg border border-[var(--grey-200)]/30 bg-[var(--grey-100)] px-3 text-sm text-[var(--grey-600)] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--grey-900)] mb-1.5">Phone</label>
            <input
              type="tel"
              value={user.phone || ''}
              disabled
              placeholder="Not set"
              className="w-full h-10 rounded-lg border border-[var(--grey-200)]/30 bg-[var(--grey-100)] px-3 text-sm text-[var(--grey-600)] cursor-not-allowed placeholder:text-[var(--grey-500)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--grey-900)] mb-1.5">Role</label>
            <input
              type="text"
              value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              disabled
              className="w-full h-10 rounded-lg border border-[var(--grey-200)]/30 bg-[var(--grey-100)] px-3 text-sm text-[var(--grey-600)] cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-[var(--grey-500)]">
            Profile editing will be available in a future update.
          </p>
        </div>
      </div>

      <div className="bg-[white] rounded-xl border border-[var(--grey-200)]/20 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--grey-900)]">Account Status</h3>
          <p className="text-sm text-[var(--grey-600)] mt-0.5">Your account details</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              user.emailVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            {user.emailVerified ? 'Email Verified' : 'Email Not Verified'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--grey-100)] text-[var(--grey-600)]">
            {user.onboardingCompleted ? 'Onboarding Complete' : 'Onboarding Pending'}
          </span>
          {user.lastLoginAt && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--grey-100)] text-[var(--grey-600)]">
              Last login:{' '}
              {new Date(user.lastLoginAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
