'use client';

import { useId, forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  options: SelectOption[];
  placeholder?: string;
  selectSize?: 'sm' | 'md' | 'lg';
}

const selectSizes = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-base',
  lg: 'h-12 text-lg',
} as const;

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      placeholder,
      selectSize = 'md',
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'text-sm font-medium text-[var(--color-text-primary)]',
              disabled && 'opacity-50'
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={cn(
              hasError && errorMessage ? errorId : undefined,
              helperText ? helperId : undefined
            )}
            className={cn(
              'w-full rounded-[var(--radius-md)] border bg-[var(--color-background)] pl-3 pr-10',
              'text-[var(--color-text-primary)] appearance-none cursor-pointer',
              'transition-all duration-[var(--transition-fast)]',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              selectSizes[selectSize],
              hasError
                ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/30',
              disabled && 'cursor-not-allowed opacity-50 bg-[var(--color-surface)]'
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
            <ChevronDownIcon />
          </div>
        </div>

        {hasError && errorMessage && (
          <p id={errorId} className="text-sm text-[var(--color-error)]" role="alert">
            {errorMessage}
          </p>
        )}

        {helperText && !hasError && (
          <p id={helperId} className="text-sm text-[var(--color-text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
