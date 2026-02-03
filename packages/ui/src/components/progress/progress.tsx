'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'default' | 'success' | 'warning' | 'error';

const progressSizes: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const progressVariants: Record<ProgressVariant, string> = {
  default: 'bg-[var(--color-primary)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  error: 'bg-[var(--color-error)]',
};

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
  showLabel?: boolean;
  indeterminate?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = 'md',
      variant = 'default',
      showLabel = false,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(
            'w-full overflow-hidden rounded-full bg-[var(--color-surface)]',
            progressSizes[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              progressVariants[variant],
              indeterminate && 'animate-progress-indeterminate'
            )}
            style={indeterminate ? { width: '50%' } : { width: `${percentage}%` }}
          />
        </div>
        {showLabel && !indeterminate && (
          <div className="mt-1 text-xs text-[var(--color-text-muted)] text-right">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
