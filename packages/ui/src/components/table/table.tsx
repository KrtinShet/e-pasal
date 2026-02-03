'use client';

import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';

import { cn } from '../../utils';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped';
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          'w-full caption-bottom text-sm',
          variant === 'striped' && '[&_tbody_tr:nth-child(even)]:bg-[var(--color-surface)]',
          className
        )}
        {...props}
      />
    </div>
  )
);

Table.displayName = 'Table';

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));

TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));

TableBody.displayName = 'TableBody';

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-[var(--color-surface)] font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));

TableFooter.displayName = 'TableFooter';

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-[var(--color-border)] transition-colors',
        'hover:bg-[var(--color-surface)]/50',
        'data-[state=selected]:bg-[var(--color-surface)]',
        className
      )}
      {...props}
    />
  )
);

TableRow.displayName = 'TableRow';

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-[var(--color-text-muted)]',
        '[&:has([role=checkbox])]:pr-0',
        sortable && 'cursor-pointer select-none hover:text-[var(--color-text)]',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && sortDirection && (
          <span className="text-[var(--color-text-muted)]">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  )
);

TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle text-[var(--color-text)] [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);

TableCell.displayName = 'TableCell';

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-[var(--color-text-muted)]', className)}
    {...props}
  />
));

TableCaption.displayName = 'TableCaption';
