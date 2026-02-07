'use client';

import { forwardRef } from 'react';

import { cn } from '../../utils';

import type { ScrollbarProps } from './types';

export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ children, className, ...other }, ref) => (
    <div
      ref={ref}
      className={cn(
        'overflow-auto',
        '[&::-webkit-scrollbar]:w-1.5',
        '[&::-webkit-scrollbar]:h-1.5',
        '[&::-webkit-scrollbar-thumb]:rounded-full',
        '[&::-webkit-scrollbar-thumb]:bg-black/20',
        'hover:[&::-webkit-scrollbar-thumb]:bg-black/30',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        className
      )}
      {...other}
    >
      {children}
    </div>
  )
);

Scrollbar.displayName = 'Scrollbar';
