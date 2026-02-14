'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function AlertIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
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

export default function ProductsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Products page error:', error);
  }, [error]);

  return (
    <div className="container-main py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--peach-light)] mb-6">
          <AlertIcon />
        </div>

        <h1 className="text-heading-1 font-display font-semibold text-[var(--charcoal)] mb-4">
          Unable to Load Products
        </h1>

        <p className="text-body-lg text-[var(--slate)] mb-8">
          We had trouble loading the products. This might be a temporary issue.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button type="button" onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 p-4 bg-[var(--cream-dark)] rounded-lg text-left">
            <p className="text-caption font-mono text-[var(--store-primary)]">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
