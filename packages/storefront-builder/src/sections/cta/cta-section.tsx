'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';

export type CTAVariant = 'simple' | 'gradient' | 'image';

export interface CTASectionProps extends BaseSectionProps {
  variant?: CTAVariant;
  headline: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

export function CTASection({
  className,
  variant = 'simple',
  headline,
  description,
  buttonText,
  buttonLink = '#',
  backgroundImage,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden py-20',
        variant === 'simple' && 'bg-[var(--color-primary)]',
        variant === 'gradient' &&
          'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]',
        variant === 'image' && 'bg-gray-900',
        className
      )}
      style={
        variant === 'image' && backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {variant === 'image' && <div className="absolute inset-0 bg-black/60" />}

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">{headline}</h2>
        {description && <p className="mt-4 text-lg text-white/80">{description}</p>}
        {buttonText && (
          <a
            href={buttonLink}
            className="mt-8 inline-flex items-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-[var(--color-primary)] transition-opacity hover:opacity-90"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
