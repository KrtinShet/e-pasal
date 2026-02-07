'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Input, Alert, Button } from '@baazarify/ui';
import { Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { resetPasswordApi } from '@/lib/auth-api';

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
          <ShieldCheck className="w-12 h-12 text-[var(--color-primary)]" />
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Enter your new password below.
        </p>
      </div>

      {error && (
        <div className="mb-5">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Input
            label="New password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm new password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Update password
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to sign in
        </Link>
      </div>
    </>
  );
}
