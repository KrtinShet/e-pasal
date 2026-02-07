'use client';

import type { ReactNode } from 'react';

import { cn } from '../../utils';

interface CarouselProps {
  emblaRef: (node: HTMLDivElement | null) => void;
  children: ReactNode;
  className?: string;
}

export function Carousel({ emblaRef, children, className }: CarouselProps) {
  return (
    <div className={cn('overflow-hidden', className)} ref={emblaRef}>
      <div className="flex">{children}</div>
    </div>
  );
}

interface CarouselSlideProps {
  children: ReactNode;
  className?: string;
}

export function CarouselSlide({ children, className }: CarouselSlideProps) {
  return <div className={cn('flex-[0_0_100%] min-w-0', className)}>{children}</div>;
}
