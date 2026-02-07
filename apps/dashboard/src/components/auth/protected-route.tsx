'use client';

import { Spinner } from '@baazarify/ui';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
  requireStore?: boolean;
}

export function ProtectedRoute({ children, requireStore = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (requireStore && !user.hasStore) {
      router.replace('/onboarding');
      return;
    }
  }, [user, loading, requireStore, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;
  if (requireStore && !user.hasStore) return null;

  return <>{children}</>;
}
