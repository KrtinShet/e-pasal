'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';
import {
  InlineText,
  InlineToggle,
  InlineSelect,
  EditableElement,
  useSectionEditor,
  InlineItemActions,
  InlineListToolbar,
} from '../../renderer';

export interface ContactField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  placeholder?: string;
}

export interface ContactSectionProps extends BaseSectionProps {
  title?: string;
  description?: string;
  showMap?: boolean;
  fields: ContactField[];
  submitText?: string;
}

const defaultFields: ContactField[] = [
  { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your name' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+977-' },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    required: true,
    placeholder: 'How can we help?',
  },
];

export function ContactSection({
  className,
  title = 'Contact Us',
  description,
  showMap = false,
  fields = defaultFields,
  submitText = 'Send Message',
}: ContactSectionProps) {
  const { editMode, append, removeAt, moveItem } = useSectionEditor();

  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        {editMode && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <InlineToggle path="showMap" checked={showMap} label="Show map" />
            <InlineListToolbar
              label="Add field"
              onAdd={() =>
                append('fields', {
                  name: `field_${fields.length + 1}`,
                  label: 'New Field',
                  type: 'text',
                  required: false,
                  placeholder: '',
                })
              }
            />
          </div>
        )}

        <div
          className={cn(
            'grid gap-12',
            showMap ? 'grid-cols-1 md:grid-cols-2' : 'mx-auto max-w-2xl'
          )}
        >
          <div>
            {title && (
              <EditableElement path="title">
                <InlineText
                  path="title"
                  value={title}
                  as="h2"
                  className="font-display text-3xl font-bold text-[var(--color-text-primary)]"
                />
              </EditableElement>
            )}
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
            <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
              {fields.map((field, index) => (
                <div key={`${field.name}-${index}`}>
                  {editMode && (
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <InlineItemActions
                        onMoveUp={
                          index > 0 ? () => moveItem('fields', index, index - 1) : undefined
                        }
                        onMoveDown={
                          index < fields.length - 1
                            ? () => moveItem('fields', index, index + 1)
                            : undefined
                        }
                        onDelete={() => removeAt('fields', index)}
                      />
                      <InlineSelect
                        path={`fields.${index}.type`}
                        value={field.type}
                        options={['text', 'email', 'tel', 'textarea']}
                        label="Type"
                      />
                      <InlineToggle
                        path={`fields.${index}.required`}
                        checked={Boolean(field.required)}
                        label="Required"
                      />
                    </div>
                  )}
                  <label
                    htmlFor={`${field.name}-${index}`}
                    className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]"
                  >
                    <InlineText path={`fields.${index}.label`} value={field.label} as="span" />
                    {field.required && <span className="text-[var(--color-error)]"> *</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={`${field.name}-${index}`}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  ) : (
                    <input
                      id={`${field.name}-${index}`}
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  )}
                  {editMode && (
                    <InlineText
                      path={`fields.${index}.placeholder`}
                      value={field.placeholder}
                      as="p"
                      placeholder="Field placeholder text"
                      className="mt-1 text-xs text-[var(--color-text-muted)]"
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
              >
                <InlineText path="submitText" value={submitText} as="span" />
              </button>
            </form>
          </div>

          {showMap && (
            <div className="flex items-center justify-center rounded-xl bg-[var(--color-surface)]">
              <p className="text-[var(--color-text-muted)]">Map placeholder</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
