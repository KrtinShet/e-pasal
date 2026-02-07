'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';

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
  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={cn(
            'grid gap-12',
            showMap ? 'grid-cols-1 md:grid-cols-2' : 'mx-auto max-w-2xl'
          )}
        >
          <div>
            {title && (
              <h2 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-[var(--color-text-secondary)]">{description}</p>
            )}
            <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]"
                  >
                    {field.label}
                    {field.required && <span className="text-[var(--color-error)]"> *</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  ) : (
                    <input
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
              >
                {submitText}
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
