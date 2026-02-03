'use client';

import { cn } from '../../utils';

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
  showPageSizeSelector = true,
  showItemCount = true,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-3 border-t border-[var(--color-border)]',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--color-text-muted)]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={cn(
                'px-2 py-1 rounded border border-[var(--color-border)]',
                'bg-[var(--color-background)] text-[var(--color-text)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20'
              )}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
        {showItemCount && (
          <span className="text-sm text-[var(--color-text-muted)]">
            {startItem}-{endItem} of {totalItems}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
          className={cn(
            'p-2 rounded transition-colors',
            'hover:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="First page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={cn(
            'p-2 rounded transition-colors',
            'hover:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Previous page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span className="px-3 text-sm text-[var(--color-text)]">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={cn(
            'p-2 rounded transition-colors',
            'hover:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Next page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className={cn(
            'p-2 rounded transition-colors',
            'hover:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Last page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
