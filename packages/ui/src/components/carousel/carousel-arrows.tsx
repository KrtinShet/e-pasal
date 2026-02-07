'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '../../utils';

import { LeftArrowIcon, RightArrowIcon } from './arrow-icons';

interface CarouselArrowsProps extends HTMLAttributes<HTMLDivElement> {
  filled?: boolean;
  shape?: 'circular' | 'rounded';
  onNext?: VoidFunction;
  onPrev?: VoidFunction;
}

export function CarouselArrows({
  shape = 'circular',
  filled = false,
  onNext,
  onPrev,
  children,
  className,
  ...other
}: CarouselArrowsProps) {
  const buttonBase = cn(
    'inline-flex items-center justify-center p-2 transition-all',
    shape === 'circular' ? 'rounded-full' : 'rounded-lg',
    filled
      ? 'text-white/80 bg-black/50 hover:text-white hover:bg-black'
      : 'opacity-50 hover:opacity-100'
  );

  if (children) {
    return (
      <div className={cn('relative', className)} {...other}>
        {onPrev && (
          <button
            type="button"
            onClick={onPrev}
            className={cn(buttonBase, 'absolute left-4 top-1/2 -translate-y-1/2 z-10')}
            aria-label="Previous"
          >
            <LeftArrowIcon />
          </button>
        )}

        {children}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className={cn(buttonBase, 'absolute right-4 top-1/2 -translate-y-1/2 z-10')}
            aria-label="Next"
          >
            <RightArrowIcon />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-1', className)} {...other}>
      <button type="button" onClick={onPrev} className={buttonBase} aria-label="Previous">
        <LeftArrowIcon />
      </button>
      <button type="button" onClick={onNext} className={buttonBase} aria-label="Next">
        <RightArrowIcon />
      </button>
    </div>
  );
}
