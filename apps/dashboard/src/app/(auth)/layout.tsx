'use client';

import { AuthLayout } from '@baazarify/ui';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth } from '@/contexts/auth-context';

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      if (!user.hasStore) {
        router.replace('/onboarding');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || user) return null;

  return (
    <AuthLayout
      logo={<span className="text-2xl font-bold text-[var(--color-text-primary)]">Baazarify</span>}
      illustration={
        <div className="text-white text-center space-y-4">
          <h2 className="text-3xl font-bold">Build your online store</h2>
          <p className="text-lg opacity-80">
            Launch your e-commerce business in Nepal with Baazarify.
          </p>
        </div>
      }
      illustrationPosition="left"
    >
      {children}
    </AuthLayout>
  );
}
