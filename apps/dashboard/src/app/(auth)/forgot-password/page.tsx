'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
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
      <>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Check your email</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            If an account with that email exists, we&apos;ve sent a password reset link.
          </p>
        </div>

        <Link href="/login">
          <Button variant="outline" fullWidth>
            Back to login
          </Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Forgot password?</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <Button type="submit" fullWidth loading={loading}>
          Send reset link
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
