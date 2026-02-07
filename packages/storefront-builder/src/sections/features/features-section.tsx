'use client';

import { cn } from '@baazarify/ui';
import type { ReactNode } from 'react';

import type { BaseSectionProps } from '../types';

export type FeaturesVariant = 'grid' | 'list' | 'cards';

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface FeaturesSectionProps extends BaseSectionProps {
  variant?: FeaturesVariant;
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
}

const iconMap: Record<string, ReactNode> = {
  truck: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
      />
    </svg>
  ),
  shield: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  refresh: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  star: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  ),
};

function DefaultIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function FeatureIcon({ icon }: { icon?: string }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
      {icon && iconMap[icon] ? iconMap[icon] : <DefaultIcon />}
    </div>
  );
}

export function FeaturesSection({
  className,
  variant = 'grid',
  title,
  subtitle,
  features,
}: FeaturesSectionProps) {
  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-lg text-[var(--color-text-secondary)]">{subtitle}</p>
            )}
          </div>
        )}

        {variant === 'grid' && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex justify-center">
                  <FeatureIcon icon={feature.icon} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[var(--color-text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {variant === 'list' && (
          <div className="mx-auto max-w-3xl space-y-8">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-4">
                <FeatureIcon icon={feature.icon} />
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-[var(--color-text-secondary)]">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === 'cards' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 transition-shadow hover:shadow-md"
              >
                <FeatureIcon icon={feature.icon} />
                <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[var(--color-text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
