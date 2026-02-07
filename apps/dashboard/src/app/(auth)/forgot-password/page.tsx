'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { Input, Alert, Button } from '@baazarify/ui';

import { forgotPasswordApi } from '@/lib/auth-api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPasswordApi(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
            <KeyRound className="w-12 h-12 text-[var(--color-primary)]" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Request sent successfully!
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          We&apos;ve sent a password reset link to your email.
          <br />
          Please check your inbox and follow the link to reset your password.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
          <KeyRound className="w-12 h-12 text-[var(--color-primary)]" />
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Please enter the email address associated with your account and we&apos;ll email you a
          link to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-5">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <Button type="submit" fullWidth loading={loading}>
          Send request
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
