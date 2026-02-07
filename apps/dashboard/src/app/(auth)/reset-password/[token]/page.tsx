'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Input, Alert, Button } from '@baazarify/ui';
import { useParams, useRouter } from 'next/navigation';

import { resetPasswordApi } from '@/lib/auth-api';

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPasswordApi(params.token, password);
      if (!result.user.hasStore) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Reset your password</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Enter your new password below.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          required
          autoComplete="new-password"
        />
        <Input
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth loading={loading}>
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
          Back to login
        </Link>
      </p>
    </>
  );
}
