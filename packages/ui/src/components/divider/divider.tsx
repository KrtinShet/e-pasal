'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  children?: ReactNode;
}

const variantStyles = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
} as const;

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', variant = 'solid', children, ...props }, ref) => {
    const isHorizontal = orientation === 'horizontal';

    if (children) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation={orientation}
          className={cn(
            'flex items-center',
            isHorizontal ? 'w-full' : 'h-full flex-col',
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'border-[var(--color-border)]',
              variantStyles[variant],
              isHorizontal ? 'flex-1 border-t' : 'flex-1 border-l'
            )}
          />
          <span
            className={cn(
              'text-sm text-[var(--color-text-muted)] flex-shrink-0',
              isHorizontal ? 'px-3' : 'py-3'
            )}
          >
            {children}
          </span>
          <div
            className={cn(
              'border-[var(--color-border)]',
              variantStyles[variant],
              isHorizontal ? 'flex-1 border-t' : 'flex-1 border-l'
            )}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          'border-[var(--color-border)]',
          variantStyles[variant],
          isHorizontal ? 'w-full border-t' : 'h-full border-l',
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
