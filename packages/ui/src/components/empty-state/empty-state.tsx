'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    container: 'py-8',
    icon: 'w-10 h-10',
    title: 'text-base',
    description: 'text-sm',
  },
  md: {
    container: 'py-12',
    icon: 'w-12 h-12',
    title: 'text-lg',
    description: 'text-sm',
  },
  lg: {
    container: 'py-16',
    icon: 'w-16 h-16',
    title: 'text-xl',
    description: 'text-base',
  },
};

function DefaultIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, size = 'md', ...props }, ref) => {
    const sizes = sizeClasses[size];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          sizes.container,
          className
        )}
        {...props}
      >
        <div className={cn('text-[var(--color-text-muted)] mb-4', sizes.icon)}>
          {icon || <DefaultIcon className="w-full h-full" />}
        </div>
        <h3 className={cn('font-medium text-[var(--color-text)]', sizes.title)}>{title}</h3>
        {description && (
          <p className={cn('mt-1 text-[var(--color-text-muted)] max-w-sm', sizes.description)}>
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
