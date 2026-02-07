'use client';

import { useState } from 'react';
import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps extends BaseSectionProps {
  title?: string;
  items: FAQItem[];
}

function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--color-border)]">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-medium text-[var(--color-text-primary)]">{item.question}</span>
        <svg
          className={cn(
            'h-5 w-5 flex-shrink-0 text-[var(--color-text-muted)] transition-transform',
            open && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-4 text-[var(--color-text-secondary)]">{item.answer}</div>}
    </div>
  );
}

export function FAQSection({ className, title, items }: FAQSectionProps) {
  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-3xl px-6">
        {title && (
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-[var(--color-text-primary)]">
            {title}
          </h2>
        )}
        <div className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
          {items.map((item, i) => (
            <FAQAccordion key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
