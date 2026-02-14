'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function AlertIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--store-primary)]"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Storefront error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="container-main text-center py-16">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--peach-light)] mb-8">
          <AlertIcon />
        </div>

        <h1 className="text-heading-1 font-display mb-4">Something went wrong</h1>

        <p className="text-body-lg text-[var(--muted)] max-w-md mx-auto mb-8">
          We encountered an error while loading this page. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button type="button" onClick={reset} className="btn-primary">
            Try Again
          </button>
          <a href="/" className="btn-secondary">
            Go Home
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 p-4 bg-[var(--cream-dark)] rounded-lg text-left max-w-xl mx-auto">
            <p className="text-caption font-mono text-[var(--store-primary)]">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
