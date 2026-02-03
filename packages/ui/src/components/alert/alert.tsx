'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const alertVariants = {
  info: {
    container: 'bg-[var(--color-info)]/10 border-[var(--color-info)]/30',
    icon: 'text-[var(--color-info)]',
    title: 'text-[var(--color-info)]',
    description: 'text-[var(--color-text-secondary)]',
  },
  success: {
    container: 'bg-[var(--color-success)]/10 border-[var(--color-success)]/30',
    icon: 'text-[var(--color-success)]',
    title: 'text-[var(--color-success)]',
    description: 'text-[var(--color-text-secondary)]',
  },
  warning: {
    container: 'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/30',
    icon: 'text-[var(--color-warning)]',
    title: 'text-[var(--color-warning)]',
    description: 'text-[var(--color-text-secondary)]',
  },
  error: {
    container: 'bg-[var(--color-error)]/10 border-[var(--color-error)]/30',
    icon: 'text-[var(--color-error)]',
    title: 'text-[var(--color-error)]',
    description: 'text-[var(--color-text-secondary)]',
  },
} as const;

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function CloseIcon() {
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

const variantIcons = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
} as const;

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
  showIcon?: boolean;
  onClose?: () => void;
  children?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, variant = 'info', title, icon, showIcon = true, onClose, children, ...props },
    ref
  ) => {
    const styles = alertVariants[variant];
    const DefaultIcon = variantIcons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative flex gap-3 p-4 rounded-[var(--radius-md)] border',
          styles.container,
          className
        )}
        {...props}
      >
        {showIcon && (
          <div className={cn('flex-shrink-0', styles.icon)}>{icon || <DefaultIcon />}</div>
        )}

        <div className="flex-1 min-w-0">
          {title && <h5 className={cn('font-medium mb-1', styles.title)}>{title}</h5>}
          {children && <div className={cn('text-sm', styles.description)}>{children}</div>}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'flex-shrink-0 p-1 rounded-[var(--radius-sm)]',
              'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
              'hover:bg-black/5 transition-colors duration-[var(--transition-fast)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30'
            )}
            aria-label="Close alert"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
