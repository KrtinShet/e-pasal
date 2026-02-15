'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';
import { InlineText, useSectionEditor, EditableElement } from '../../renderer';

export interface NewsletterSectionProps extends BaseSectionProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

export function NewsletterSection({
  className,
  title = 'Stay Updated',
  description,
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
}: NewsletterSectionProps) {
  const { editMode } = useSectionEditor();

  return (
    <section className={cn('bg-[var(--color-surface)] py-16', className)}>
      <div className="mx-auto max-w-2xl px-6 text-center">
        <EditableElement path="title">
          <InlineText
            path="title"
            value={title}
            as="h2"
            className="font-display text-3xl font-bold text-[var(--color-text-primary)]"
          />
        </EditableElement>
        {description && (
          <EditableElement path="description">
            <InlineText
              path="description"
              value={description}
              as="p"
              multiline
              className="mt-4 text-[var(--color-text-secondary)]"
            />
          </EditableElement>
        )}
        <form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder={placeholder || 'Enter your email'}
            className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            <InlineText path="buttonText" value={buttonText} as="span" />
          </button>
        </form>
        {editMode && (
          <div className="mt-2">
            <InlineText
              path="placeholder"
              value={placeholder}
              as="span"
              className="text-xs text-[var(--color-text-muted)]"
              placeholder="Input placeholder text"
            />
          </div>
        )}
      </div>
    </section>
  );
}
