'use client';

import { cn } from '../../utils';

interface CarouselDotsProps {
  count: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  rounded?: boolean;
  className?: string;
}

export function CarouselDots({
  count,
  selectedIndex,
  onSelect,
  rounded = false,
  className,
}: CarouselDotsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-1 z-10', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className={cn(
            'h-2 rounded-full bg-[var(--color-primary)] transition-all',
            index === selectedIndex ? cn('opacity-100', rounded ? 'w-4' : 'w-2') : 'w-2 opacity-30'
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
