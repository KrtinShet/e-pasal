'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="warm-mesh flex min-h-screen items-center justify-center p-4">
      <div className="bzr-card animate-materialize w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-lighter)]">
            <ShieldCheck className="h-7 w-7 text-[var(--primary-main)]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--grey-900)]">
            Baazarify Admin
          </h1>
          <p className="mt-1 text-sm text-[var(--grey-400)]">Sign in to the admin panel</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--grey-500)] uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@baazarify.com"
              className="w-full rounded-xl border border-[var(--grey-200)] bg-white px-4 py-3 text-sm text-[var(--grey-900)] outline-none transition-all placeholder:text-[var(--grey-300)] focus:border-[var(--primary-main)] focus:ring-2 focus:ring-[var(--primary-lighter)]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--grey-500)] uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[var(--grey-200)] bg-white px-4 py-3 text-sm text-[var(--grey-900)] outline-none transition-all placeholder:text-[var(--grey-300)] focus:border-[var(--primary-main)] focus:ring-2 focus:ring-[var(--primary-lighter)]"
            />
          </div>

          <button
            type="submit"
            className="btn-coral w-full rounded-xl bg-[var(--primary-main)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-dark)]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
