'use client';

import Link from 'next/link';
import { Button } from '@baazarify/ui';

interface StepCompleteProps {
  subdomain: string;
}

export function StepComplete({ subdomain }: StepCompleteProps) {
  const storeUrl = `http://${subdomain}.localhost`;

  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-[var(--grey-900)]">Your store is ready!</h3>
        <p className="mt-2 text-[var(--grey-500)]">
          Your store is live at{' '}
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary-main)] font-medium hover:underline"
          >
            {storeUrl}
          </a>
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <Link href="/dashboard">
          <Button fullWidth>Go to dashboard</Button>
        </Link>
        <a href={storeUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" fullWidth>
            Visit your store
          </Button>
        </a>
      </div>
    </div>
  );
}
