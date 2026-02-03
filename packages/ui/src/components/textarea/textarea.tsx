'use client';

import { useId, forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const resizeClasses = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
} as const;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      resize = 'vertical',
      disabled,
      id: providedId,
      rows = 4,
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

        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          rows={rows}
          aria-invalid={hasError}
          aria-describedby={cn(
            hasError && errorMessage ? errorId : undefined,
            helperText ? helperId : undefined
          )}
          className={cn(
            'w-full rounded-[var(--radius-md)] border bg-[var(--color-background)] px-3 py-2',
            'text-[var(--color-text-primary)] text-base placeholder:text-[var(--color-text-muted)]',
            'transition-all duration-[var(--transition-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'min-h-[80px]',
            resizeClasses[resize],
            hasError
              ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
              : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/30',
            disabled && 'cursor-not-allowed opacity-50 bg-[var(--color-surface)]'
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
