'use client';

import {
  useId,
  forwardRef,
  type ReactNode,
  type MouseEventHandler,
  type InputHTMLAttributes,
} from 'react';

import { cn } from '../../utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  inputSize?: 'sm' | 'md' | 'lg';
}

const inputSizes = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-base',
  lg: 'h-12 text-lg',
} as const;

const iconContainerSizes = {
  sm: 'w-8',
  md: 'w-10',
  lg: 'w-12',
} as const;

function ClearIcon() {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      clearable,
      onClear,
      inputSize = 'md',
      disabled,
      id: providedId,
      value,
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
    const showClearButton = clearable && value && !disabled;

    const handleClear: MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault();
      onClear?.();
    };

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

        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className={cn(
                'absolute left-0 flex items-center justify-center text-[var(--color-text-muted)] pointer-events-none',
                iconContainerSizes[inputSize]
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            value={value}
            aria-invalid={hasError}
            aria-describedby={cn(
              hasError && errorMessage ? errorId : undefined,
              helperText ? helperId : undefined
            )}
            className={cn(
              'w-full rounded-[var(--radius-md)] border bg-[var(--color-background)] px-3',
              'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'transition-all duration-[var(--transition-fast)]',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              inputSizes[inputSize],
              leftIcon && 'pl-10',
              (rightIcon || showClearButton) && 'pr-10',
              hasError
                ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/30',
              disabled && 'cursor-not-allowed opacity-50 bg-[var(--color-surface)]'
            )}
            {...props}
          />

          {(rightIcon || showClearButton) && (
            <div
              className={cn(
                'absolute right-0 flex items-center justify-center',
                iconContainerSizes[inputSize]
              )}
            >
              {showClearButton ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className={cn(
                    'p-1 rounded-full text-[var(--color-text-muted)]',
                    'hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]',
                    'transition-colors duration-[var(--transition-fast)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30'
                  )}
                  aria-label="Clear input"
                >
                  <ClearIcon />
                </button>
              ) : (
                <span className="text-[var(--color-text-muted)] pointer-events-none">
                  {rightIcon}
                </span>
              )}
            </div>
          )}
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

Input.displayName = 'Input';
