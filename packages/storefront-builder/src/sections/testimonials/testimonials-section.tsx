'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';
import {
  InlineText,
  InlineImage,
  InlineSelect,
  InlineNumber,
  useSectionEditor,
  InlineItemActions,
  InlineListToolbar,
  EditableElement,
} from '../../renderer';

export type TestimonialsVariant = 'carousel' | 'grid';

export interface TestimonialItem {
  name: string;
  role?: string;
  content: string;
  rating?: number;
  avatar?: string;
}

export interface TestimonialsSectionProps extends BaseSectionProps {
  variant?: TestimonialsVariant;
  title?: string;
  testimonials: TestimonialItem[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'text-[var(--color-accent)]' : 'text-[var(--color-border)]'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  total,
}: {
  testimonial: TestimonialItem;
  index: number;
  total: number;
}) {
  const { editMode, removeAt, moveItem } = useSectionEditor();

  return (
    <div className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6">
      {editMode && (
        <div className="mb-3 flex items-center justify-between">
          <InlineItemActions
            onMoveUp={index > 0 ? () => moveItem('testimonials', index, index - 1) : undefined}
            onMoveDown={
              index < total - 1 ? () => moveItem('testimonials', index, index + 1) : undefined
            }
            onDelete={() => removeAt('testimonials', index)}
          />
          {typeof testimonial.rating === 'number' ? (
            <InlineNumber
              path={`testimonials.${index}.rating`}
              value={testimonial.rating}
              min={1}
              max={5}
              step={1}
              className="!w-14 text-xs"
            />
          ) : null}
        </div>
      )}

      {testimonial.rating ? <StarRating rating={testimonial.rating} /> : null}
      <blockquote className="mt-4 flex-1 text-[var(--color-text-secondary)]">
        <InlineText
          path={`testimonials.${index}.content`}
          value={testimonial.content}
          multiline
          as="span"
        />
      </blockquote>
      <div className="mt-6 flex items-center gap-3">
        {testimonial.avatar ? (
          <InlineImage
            srcPath={`testimonials.${index}.avatar`}
            src={testimonial.avatar}
            altPath={`testimonials.${index}.name`}
            alt={testimonial.name}
            className="h-10 w-10 rounded-full object-cover"
            placeholderClassName="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-white">
            {testimonial.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <InlineText
            path={`testimonials.${index}.name`}
            value={testimonial.name}
            as="p"
            className="font-medium text-[var(--color-text-primary)]"
          />
          {testimonial.role && (
            <InlineText
              path={`testimonials.${index}.role`}
              value={testimonial.role}
              as="p"
              className="text-sm text-[var(--color-text-muted)]"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({
  className,
  variant = 'grid',
  title,
  testimonials,
}: TestimonialsSectionProps) {
  const { editMode, append } = useSectionEditor();

  return (
    <section className={cn('bg-[var(--color-surface)] py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        {editMode && (
          <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
            <InlineSelect
              path="variant"
              value={variant}
              options={['carousel', 'grid']}
              label="Variant"
            />
            <InlineListToolbar
              label="Add testimonial"
              onAdd={() =>
                append('testimonials', {
                  name: 'Customer Name',
                  role: 'Customer',
                  content: 'Share a short testimonial here.',
                  rating: 5,
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

        {variant === 'grid' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} testimonial={t} index={i} total={testimonials.length} />
            ))}
          </div>
        )}

        {variant === 'carousel' && (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {testimonials.map((t, i) => (
              <div key={i} className="w-[350px] flex-shrink-0">
                <TestimonialCard testimonial={t} index={i} total={testimonials.length} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
