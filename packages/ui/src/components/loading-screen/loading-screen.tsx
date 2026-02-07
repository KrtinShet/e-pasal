'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface LoadingScreenProps extends HTMLAttributes<HTMLDivElement> {}

export function LoadingScreen({ className, ...other }: LoadingScreenProps) {
  return (
    <div
      className={cn('flex flex-1 items-center justify-center px-5 min-h-full w-full', className)}
      {...other}
    >
      <div className="w-full max-w-[360px]">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
          <div className="h-full w-full origin-left animate-[indeterminate_1.5s_ease-in-out_infinite] rounded-full bg-current" />
        </div>
      </div>
    </div>
  );
}
