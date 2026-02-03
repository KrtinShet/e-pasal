'use client';

import { useId, forwardRef, type ReactNode, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: ReactNode;
  description?: string;
  error?: string | boolean;
  checkboxSize?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
}

const checkboxSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
} as const;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      checkboxSize = 'md',
      indeterminate = false,
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
              id={id}
              disabled={disabled}
              checked={checked}
              aria-invalid={hasError}
              aria-describedby={hasError && errorMessage ? errorId : undefined}
              className={cn(
                'peer appearance-none rounded-[var(--radius-sm)] border-2 bg-[var(--color-background)]',
                'transition-all duration-[var(--transition-fast)]',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                checkboxSizes[checkboxSize],
                checked || indeterminate
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                  : 'border-[var(--color-border)]',
                hasError
                  ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
                  : 'focus:ring-[var(--color-primary)]/30',
                disabled && 'cursor-not-allowed'
              )}
              {...props}
            />
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center text-white pointer-events-none',
                'opacity-0 peer-checked:opacity-100 transition-opacity duration-[var(--transition-fast)]',
                indeterminate && 'opacity-100'
              )}
            >
              {indeterminate ? (
                <MinusIcon className={iconSizes[checkboxSize]} />
              ) : (
                <CheckIcon className={iconSizes[checkboxSize]} />
              )}
            </div>
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
          <p id={errorId} className="text-sm text-[var(--color-error)] ml-8" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
