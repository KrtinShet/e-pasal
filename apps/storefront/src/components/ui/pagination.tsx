'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import type { PaginationInfo } from '@/types/product';

interface PaginationProps {
  pagination: PaginationInfo;
  basePath?: string;
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);

  return pages;
}

export function Pagination({ pagination, basePath = '/products' }: PaginationProps) {
  const searchParams = useSearchParams();
  const { page, pages, total } = pagination;

  if (pages <= 1) return null;

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNum === 1) {
      params.delete('page');
    } else {
      params.set('page', pageNum.toString());
    }
    const queryString = params.toString();
    return `${basePath}${queryString ? `?${queryString}` : ''}`;
  };

  const pageNumbers = getPageNumbers(page, pages);

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      {page > 1 ? (
        <Link
          href={createPageUrl(page - 1)}
          className="flex items-center gap-1 px-3 py-2 text-body-sm text-[var(--grey-600)] hover:text-[var(--grey-900)] hover:bg-[var(--grey-100)] rounded-lg transition-colors"
          aria-label="Go to previous page"
        >
          <ChevronLeftIcon />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-body-sm text-[var(--grey-300)] cursor-not-allowed">
          <ChevronLeftIcon />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum, index) =>
          pageNum === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="w-10 h-10 flex items-center justify-center text-[var(--grey-600)]"
            >
              ...
            </span>
          ) : (
            <Link
              key={pageNum}
              href={createPageUrl(pageNum)}
              className={`w-10 h-10 flex items-center justify-center text-body-sm rounded-lg transition-colors ${
                pageNum === page
                  ? 'bg-[var(--grey-900)] text-white font-medium'
                  : 'text-[var(--grey-600)] hover:text-[var(--grey-900)] hover:bg-[var(--grey-100)]'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          )
        )}
      </div>

      {page < pages ? (
        <Link
          href={createPageUrl(page + 1)}
          className="flex items-center gap-1 px-3 py-2 text-body-sm text-[var(--grey-600)] hover:text-[var(--grey-900)] hover:bg-[var(--grey-100)] rounded-lg transition-colors"
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-body-sm text-[var(--grey-300)] cursor-not-allowed">
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon />
        </span>
      )}

      <span className="hidden md:block ml-4 text-body-sm text-[var(--grey-600)]">
        Page {page} of {pages} ({total} items)
      </span>
    </nav>
  );
}
