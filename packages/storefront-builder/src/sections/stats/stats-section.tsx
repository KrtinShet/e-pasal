'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';

export interface StatItem {
  label: string;
  value: string;
  description?: string;
}

export interface StatsSectionProps extends BaseSectionProps {
  title?: string;
  stats: StatItem[];
}

export function StatsSection({ className, title, stats }: StatsSectionProps) {
  return (
    <section className={cn('bg-[var(--color-surface)] py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        {title && (
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-[var(--color-text-primary)]">
            {title}
          </h2>
        )}
        <div
          className={cn(
            'grid gap-8',
            stats.length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'
          )}
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-4xl font-bold text-[var(--color-primary)]">
                {stat.value}
              </p>
              <p className="mt-2 font-semibold text-[var(--color-text-primary)]">{stat.label}</p>
              {stat.description && (
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{stat.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
