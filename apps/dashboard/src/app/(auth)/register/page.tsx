'use client';

import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Input, Alert, Button } from '@baazarify/ui';

import { useAuth } from '@/contexts/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const name = `${firstName} ${lastName}`.trim();

    try {
      await register({ email, password, name });
      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-[1.75rem] font-bold text-[var(--grey-900)]">
          Get started absolutely free
        </h1>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-sm text-[var(--grey-500)]">Already have an account?</span>
          <Link
            href="/login"
            className="text-sm font-semibold text-[var(--primary-main)] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-5">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            label="First name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            required
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            required
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <div className="relative">
          <Input
            label="Password"
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
            className="absolute right-3 top-[38px] text-[var(--grey-400)] hover:text-[var(--grey-500)] transition-colors"
          >
            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-[var(--grey-400)]">
        {'By signing up, I agree to '}
        <Link href="/terms" className="underline text-[var(--grey-900)]">
          Terms of Service
        </Link>
        {' and '}
        <Link href="/privacy" className="underline text-[var(--grey-900)]">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
