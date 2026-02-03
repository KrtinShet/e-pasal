'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

const toastVariants: Record<ToastVariant, string> = {
  default: 'bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-text)]',
  success:
    'bg-[var(--color-success)]/10 border-[var(--color-success)]/30 text-[var(--color-success)]',
  error: 'bg-[var(--color-error)]/10 border-[var(--color-error)]/30 text-[var(--color-error)]',
  warning:
    'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/30 text-[var(--color-warning)]',
  info: 'bg-[var(--color-info)]/10 border-[var(--color-info)]/30 text-[var(--color-info)]',
};

const toastIcons: Record<ToastVariant, string> = {
  default: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning:
    'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title?: string;
  description?: string;
  onClose?: () => void;
  showIcon?: boolean;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant = 'default',
      title,
      description,
      onClose,
      showIcon = true,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border shadow-lg',
        'animate-in slide-in-from-right-full',
        toastVariants[variant],
        className
      )}
      {...props}
    >
      {showIcon && (
        <svg
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={toastIcons[variant]} />
        </svg>
      )}
      <div className="flex-1 min-w-0">
        {title && <div className="font-medium">{title}</div>}
        {description && (
          <div
            className={cn(
              'text-sm',
              title && 'mt-1',
              variant === 'default' && 'text-[var(--color-text-muted)]'
            )}
          >
            {description}
          </div>
        )}
        {children}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'flex-shrink-0 p-1 rounded transition-colors',
            'hover:bg-black/5 dark:hover:bg-white/10'
          )}
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
);

Toast.displayName = 'Toast';
