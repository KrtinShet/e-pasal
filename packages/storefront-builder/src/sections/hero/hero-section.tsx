'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';
import {
  InlineLink,
  InlineText,
  InlineSelect,
  InlineNumber,
  EditableElement,
  useSectionEditor,
} from '../../renderer';

export type HeroVariant = 'centered' | 'left-aligned' | 'split';

export interface HeroSectionProps extends BaseSectionProps {
  variant?: HeroVariant;
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
}

export function HeroSection({
  className,
  variant = 'centered',
  headline,
  subheadline,
  ctaText,
  ctaLink = '#',
  secondaryCtaText,
  secondaryCtaLink = '#',
  backgroundImage,
  overlayOpacity = 0.5,
}: HeroSectionProps) {
  const { editMode } = useSectionEditor();
  const hasBackground = !!backgroundImage;

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        hasBackground ? 'min-h-[600px]' : 'min-h-[500px]',
        'flex items-center',
        className
      )}
      style={
        hasBackground
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { backgroundColor: 'var(--color-surface)' }
      }
    >
      {hasBackground && (
        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
      )}

      <div
        className={cn('relative z-10 mx-auto w-full max-w-7xl px-6 py-20', {
          'text-center': variant === 'centered',
          'text-left': variant === 'left-aligned' || variant === 'split',
        })}
      >
        {editMode && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <InlineSelect
              path="variant"
              value={variant}
              options={['centered', 'left-aligned', 'split']}
              label="Variant"
            />
            <InlineNumber
              path="overlayOpacity"
              value={overlayOpacity}
              min={0}
              max={1}
              step={0.05}
              className="!w-20"
            />
            <InlineText
              path="backgroundImage"
              value={backgroundImage}
              placeholder="Background image URL"
              as="span"
              className="inline-block min-w-[220px] text-xs text-white/90"
            />
          </div>
        )}

        <div
          className={cn({
            'mx-auto max-w-3xl': variant === 'centered',
            'max-w-2xl': variant === 'left-aligned',
            'grid grid-cols-1 items-center gap-12 md:grid-cols-2': variant === 'split',
          })}
        >
          <div>
            <EditableElement path="headline">
              <InlineText
                path="headline"
                value={headline}
                as="h1"
                className={cn(
                  'font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl',
                  hasBackground ? 'text-white' : 'text-[var(--color-text-primary)]'
                )}
              />
            </EditableElement>

            {subheadline && (
              <EditableElement path="subheadline">
                <InlineText
                  path="subheadline"
                  value={subheadline}
                  as="p"
                  multiline
                  className={cn(
                    'mt-6 text-lg md:text-xl',
                    hasBackground ? 'text-white/80' : 'text-[var(--color-text-secondary)]'
                  )}
                />
              </EditableElement>
            )}

            {(ctaText || secondaryCtaText) && (
              <div
                className={cn('mt-8 flex gap-4', {
                  'justify-center': variant === 'centered',
                })}
              >
                {ctaText && (
                  <EditableElement path="ctaText">
                    <InlineLink
                      textPath="ctaText"
                      hrefPath="ctaLink"
                      text={ctaText}
                      href={ctaLink}
                      className="inline-flex items-center rounded-lg bg-[var(--color-primary)] px-8 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
                    />
                  </EditableElement>
                )}
                {secondaryCtaText && (
                  <EditableElement path="secondaryCtaText">
                    <InlineLink
                      textPath="secondaryCtaText"
                      hrefPath="secondaryCtaLink"
                      text={secondaryCtaText}
                      href={secondaryCtaLink}
                      className={cn(
                        'inline-flex items-center rounded-lg border-2 px-8 py-3 text-base font-semibold transition-opacity hover:opacity-80',
                        hasBackground
                          ? 'border-white text-white'
                          : 'border-[var(--color-primary)] text-[var(--color-primary)]'
                      )}
                    />
                  </EditableElement>
                )}
              </div>
            )}
          </div>

          {variant === 'split' && (
            <div className="hidden md:block">
              <div className="aspect-square rounded-2xl bg-[var(--color-surface)] shadow-lg" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
