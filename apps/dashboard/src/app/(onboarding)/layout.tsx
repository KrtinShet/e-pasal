'use client';

import { Spinner } from '@baazarify/ui';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth } from '@/contexts/auth-context';

export default function OnboardingGroupLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.hasStore) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || user.hasStore) return null;

  return (
    <div className="min-h-screen bg-[var(--grey-100)]">
      <header className="border-b border-[var(--grey-200)] bg-[var(--grey-50)]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <span className="text-xl font-bold text-[var(--grey-900)]">Baazarify</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
