'use client';

import { cn } from '../../utils';

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-[var(--color-border)]">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <td key={colIndex} className={cn('p-4', className)}>
              <div className="h-4 bg-[var(--color-surface)] rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
