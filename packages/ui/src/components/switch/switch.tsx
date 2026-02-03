'use client';

import { useId, forwardRef, type ReactNode, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  description?: string;
  error?: string | boolean;
  switchSize?: 'sm' | 'md' | 'lg';
}

const switchSizes = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-10 h-5',
    thumb: 'w-4 h-4',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-12 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-6',
  },
} as const;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      error,
      switchSize = 'md',
      disabled,
      id: providedId,
      checked,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;
    const sizes = switchSizes[switchSize];

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <label
          htmlFor={id}
          className={cn(
            'flex items-start gap-3 cursor-pointer select-none',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              role="switch"
              id={id}
              disabled={disabled}
              checked={checked}
              aria-invalid={hasError}
              aria-describedby={hasError && errorMessage ? errorId : undefined}
              className="sr-only peer"
              {...props}
            />
            <div
              className={cn(
                'rounded-full transition-colors duration-[var(--transition-normal)]',
                sizes.track,
                checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]',
                hasError && !checked && 'bg-[var(--color-error)]/30',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
                hasError
                  ? 'peer-focus-visible:ring-[var(--color-error)]/30'
                  : 'peer-focus-visible:ring-[var(--color-primary)]/30'
              )}
            />
            <div
              className={cn(
                'absolute top-0.5 left-0.5 rounded-full bg-white shadow-sm',
                'transition-transform duration-[var(--transition-normal)]',
                sizes.thumb,
                checked && sizes.translate
              )}
            />
          </div>

          {(label || description) && (
            <div className="flex flex-col">
              {label && (
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {label}
                </span>
              )}
              {description && (
                <span className="text-sm text-[var(--color-text-muted)]">{description}</span>
              )}
            </div>
          )}
        </label>

        {hasError && errorMessage && (
          <p id={errorId} className="text-sm text-[var(--color-error)] ml-13" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
