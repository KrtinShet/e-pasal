'use client';

import { useState } from 'react';
import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';
import {
  InlineText,
  EditableElement,
  useSectionEditor,
  InlineItemActions,
  InlineListToolbar,
} from '../../renderer';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps extends BaseSectionProps {
  title?: string;
  items: FAQItem[];
}

function FAQAccordion({ item, index, total }: { item: FAQItem; index: number; total: number }) {
  const { editMode, removeAt, moveItem } = useSectionEditor();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--color-border)]">
      {editMode && (
        <div className="pt-3">
          <InlineItemActions
            onMoveUp={index > 0 ? () => moveItem('items', index, index - 1) : undefined}
            onMoveDown={index < total - 1 ? () => moveItem('items', index, index + 1) : undefined}
            onDelete={() => removeAt('items', index)}
          />
        </div>
      )}
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <InlineText
          path={`items.${index}.question`}
          value={item.question}
          as="span"
          className="font-medium text-[var(--color-text-primary)]"
        />
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
      {open && (
        <InlineText
          path={`items.${index}.answer`}
          value={item.answer}
          as="div"
          multiline
          className="pb-4 text-[var(--color-text-secondary)]"
        />
      )}
    </div>
  );
}

export function FAQSection({ className, title, items }: FAQSectionProps) {
  const { editMode, append } = useSectionEditor();

  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-3xl px-6">
        {editMode && (
          <div className="mb-4 flex justify-center">
            <InlineListToolbar
              label="Add FAQ"
              onAdd={() =>
                append('items', {
                  question: 'New question',
                  answer: 'New answer',
                })
              }
            />
          </div>
        )}
        {title && (
          <EditableElement path="title">
            <InlineText
              path="title"
              value={title}
              as="h2"
              className="mb-8 text-center font-display text-3xl font-bold text-[var(--color-text-primary)]"
            />
          </EditableElement>
        )}
        <div className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
          {items.map((item, i) => (
            <FAQAccordion key={i} item={item} index={i} total={items.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
