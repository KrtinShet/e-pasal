'use client';

import { forwardRef } from 'react';

import { cn } from '../../utils';

import type { LabelProps, LabelColor } from './types';

const colorMap: Record<LabelColor, { filled: string; outlined: string; soft: string }> = {
  default: {
    filled: 'bg-[var(--color-text)] text-white',
    outlined: 'border-2 border-[var(--color-text)] text-[var(--color-text)] bg-transparent',
    soft: 'bg-[var(--color-text-secondary)]/16 text-[var(--color-text-secondary)]',
  },
  primary: {
    filled: 'bg-[var(--color-primary)] text-white',
    outlined: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent',
    soft: 'bg-[var(--color-primary)]/16 text-[var(--color-primary)]',
  },
  secondary: {
    filled: 'bg-[var(--color-secondary)] text-white',
    outlined:
      'border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] bg-transparent',
    soft: 'bg-[var(--color-secondary)]/16 text-[var(--color-secondary)]',
  },
  info: {
    filled: 'bg-[var(--color-info)] text-white',
    outlined: 'border-2 border-[var(--color-info)] text-[var(--color-info)] bg-transparent',
    soft: 'bg-[var(--color-info)]/16 text-[var(--color-info)]',
  },
  success: {
    filled: 'bg-[var(--color-success)] text-white',
    outlined: 'border-2 border-[var(--color-success)] text-[var(--color-success)] bg-transparent',
    soft: 'bg-[var(--color-success)]/16 text-[var(--color-success)]',
  },
  warning: {
    filled: 'bg-[var(--color-warning)] text-white',
    outlined: 'border-2 border-[var(--color-warning)] text-[var(--color-warning)] bg-transparent',
    soft: 'bg-[var(--color-warning)]/16 text-[var(--color-warning)]',
  },
  error: {
    filled: 'bg-[var(--color-error)] text-white',
    outlined: 'border-2 border-[var(--color-error)] text-[var(--color-error)] bg-transparent',
    soft: 'bg-[var(--color-error)]/16 text-[var(--color-error)]',
  },
};

export const Label = forwardRef<HTMLSpanElement, LabelProps>(
  (
    { children, color = 'default', variant = 'soft', startIcon, endIcon, className, ...other },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap capitalize',
        'h-6 min-w-6 rounded-md px-1.5 text-xs font-bold leading-none',
        'transition-all',
        colorMap[color][variant],
        startIcon && 'pl-1',
        endIcon && 'pr-1',
        className
      )}
      {...other}
    >
      {startIcon && (
        <span className="mr-1.5 flex h-4 w-4 shrink-0 [&>svg]:h-full [&>svg]:w-full">
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span className="ml-1.5 flex h-4 w-4 shrink-0 [&>svg]:h-full [&>svg]:w-full">
          {endIcon}
        </span>
      )}
    </span>
  )
);

Label.displayName = 'Label';
