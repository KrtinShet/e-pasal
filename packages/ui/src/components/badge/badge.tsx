'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export type BadgeVariant = 'filled' | 'outlined' | 'soft';
export type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

const badgeSizes = {
  sm: 'h-5 px-1.5 text-xs gap-1',
  md: 'h-6 px-2 text-sm gap-1.5',
  lg: 'h-7 px-2.5 text-sm gap-1.5',
} as const;

const filledColors = {
  primary: 'bg-[var(--color-primary)] text-white',
  secondary: 'bg-[var(--color-secondary)] text-white',
  success: 'bg-[var(--color-success)] text-white',
  warning: 'bg-[var(--color-warning)] text-white',
  error: 'bg-[var(--color-error)] text-white',
  info: 'bg-[var(--color-info)] text-white',
  neutral: 'bg-[var(--color-text-muted)] text-white',
} as const;

const outlinedColors = {
  primary: 'border-[var(--color-primary)] text-[var(--color-primary)]',
  secondary: 'border-[var(--color-secondary)] text-[var(--color-secondary)]',
  success: 'border-[var(--color-success)] text-[var(--color-success)]',
  warning: 'border-[var(--color-warning)] text-[var(--color-warning)]',
  error: 'border-[var(--color-error)] text-[var(--color-error)]',
  info: 'border-[var(--color-info)] text-[var(--color-info)]',
  neutral: 'border-[var(--color-text-muted)] text-[var(--color-text-secondary)]',
} as const;

const softColors = {
  primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
  secondary: 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]',
  success: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
  error: 'bg-[var(--color-error)]/10 text-[var(--color-error)]',
  info: 'bg-[var(--color-info)]/10 text-[var(--color-info)]',
  neutral: 'bg-[var(--color-text-muted)]/10 text-[var(--color-text-secondary)]',
} as const;

function getBadgeColorClasses(variant: BadgeVariant, color: BadgeColor): string {
  switch (variant) {
    case 'filled':
      return filledColors[color];
    case 'outlined':
      return cn('border bg-transparent', outlinedColors[color]);
    case 'soft':
      return softColors[color];
    default:
      return filledColors[color];
  }
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  dot?: boolean;
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'filled',
      color = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      dot = false,
      children,
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-[var(--radius-full)]',
        'whitespace-nowrap leading-none',
        badgeSizes[size],
        getBadgeColorClasses(variant, color),
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'filled' ? 'bg-white' : 'bg-current'
          )}
          aria-hidden="true"
        />
      )}
      {leftIcon && !dot && (
        <span className="flex-shrink-0 w-3.5 h-3.5" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className="flex-shrink-0 w-3.5 h-3.5" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </span>
  )
);

Badge.displayName = 'Badge';
