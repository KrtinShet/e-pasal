'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';
import {
  InlineText,
  EditableElement,
  useSectionEditor,
  InlineItemActions,
  InlineListToolbar,
} from '../../renderer';

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
  const { editMode, append, removeAt, moveItem } = useSectionEditor();

  return (
    <section className={cn('bg-[var(--color-surface)] py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        {editMode && (
          <div className="mb-4 flex justify-center">
            <InlineListToolbar
              label="Add stat"
              onAdd={() =>
                append('stats', {
                  label: 'New metric',
                  value: '0',
                  description: 'Metric description',
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
              className="mb-12 text-center font-display text-3xl font-bold text-[var(--color-text-primary)]"
            />
          </EditableElement>
        )}
        <div
          className={cn(
            'grid gap-8',
            stats.length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'
          )}
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              {editMode && (
                <div className="mb-2 flex justify-center">
                  <InlineItemActions
                    onMoveUp={i > 0 ? () => moveItem('stats', i, i - 1) : undefined}
                    onMoveDown={
                      i < stats.length - 1 ? () => moveItem('stats', i, i + 1) : undefined
                    }
                    onDelete={() => removeAt('stats', i)}
                  />
                </div>
              )}
              <InlineText
                path={`stats.${i}.value`}
                value={stat.value}
                as="p"
                className="font-display text-4xl font-bold text-[var(--color-primary)]"
              />
              <InlineText
                path={`stats.${i}.label`}
                value={stat.label}
                as="p"
                className="mt-2 font-semibold text-[var(--color-text-primary)]"
              />
              {stat.description && (
                <InlineText
                  path={`stats.${i}.description`}
                  value={stat.description}
                  as="p"
                  multiline
                  className="mt-1 text-sm text-[var(--color-text-muted)]"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
