'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';

export type AboutVariant = 'image-left' | 'image-right' | 'centered';

export interface AboutSectionProps extends BaseSectionProps {
  variant?: AboutVariant;
  title?: string;
  content: string;
  image?: string;
  imageAlt?: string;
}

export function AboutSection({
  className,
  variant = 'image-right',
  title,
  content,
  image,
  imageAlt = 'About us',
}: AboutSectionProps) {
  if (variant === 'centered') {
    return (
      <section className={cn('py-16', className)}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          {title && (
            <h2 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
              {title}
            </h2>
          )}
          {image && (
            <img
              src={image}
              alt={imageAlt}
              className="mx-auto mt-8 max-h-80 rounded-xl object-cover"
            />
          )}
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
            {content}
          </p>
        </div>
      </section>
    );
  }

  const imageFirst = variant === 'image-left';

  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className={cn({ 'md:order-2': !imageFirst })}>
            {image ? (
              <img
                src={image}
                alt={imageAlt}
                className="w-full rounded-xl object-cover shadow-lg"
              />
            ) : (
              <div className="aspect-[4/3] rounded-xl bg-[var(--color-surface)]" />
            )}
          </div>
          <div className={cn({ 'md:order-1': !imageFirst })}>
            {title && (
              <h2 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
                {title}
              </h2>
            )}
            <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              {content}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
