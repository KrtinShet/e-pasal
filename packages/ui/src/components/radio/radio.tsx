'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string | boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, disabled, id, ...props }, ref) => {
    const inputId = id || `radio-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!error;

    return (
      <div className={cn('flex items-start gap-2', className)}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            disabled={disabled}
            className={cn(
              'peer h-4 w-4 appearance-none rounded-full border-2 transition-colors',
              'border-[var(--color-border)] bg-[var(--color-background)]',
              'checked:border-[var(--color-primary)] checked:bg-[var(--color-primary)]',
              'hover:border-[var(--color-primary-hover)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-[var(--color-error)]'
            )}
            aria-invalid={hasError}
            {...props}
          />
          <div
            className={cn(
              'pointer-events-none absolute inset-0 flex items-center justify-center',
              'opacity-0 peer-checked:opacity-100 transition-opacity'
            )}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm text-[var(--color-text)] cursor-pointer select-none',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
