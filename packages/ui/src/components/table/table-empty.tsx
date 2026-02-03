'use client';

import type { ReactNode } from 'react';

import { cn } from '../../utils';

export interface TableEmptyProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  colSpan?: number;
  className?: string;
}

export function TableEmpty({
  title = 'No data',
  description = 'There are no items to display.',
  icon,
  action,
  colSpan = 1,
  className,
}: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={cn('h-48 text-center', className)}>
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          {icon || (
            <svg
              className="w-12 h-12 text-[var(--color-text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          )}
          <div className="text-center">
            <h3 className="text-sm font-medium text-[var(--color-text)]">{title}</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
          </div>
          {action && <div className="mt-2">{action}</div>}
        </div>
      </td>
    </tr>
  );
}
