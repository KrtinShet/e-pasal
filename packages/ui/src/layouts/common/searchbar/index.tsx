'use client';

import { memo, useState, useEffect, forwardRef, useCallback, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';

import { applyFilter, groupedData, type SearchItem } from './utils';

export interface SearchbarProps extends HTMLAttributes<HTMLDivElement> {
  items?: SearchItem[];
  onClickItem?: (path: string) => void;
}

const SearchbarInner = forwardRef<HTMLDivElement, SearchbarProps>(
  ({ className, items = [], onClickItem, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const handleClose = useCallback(() => {
      setOpen(false);
      setQuery('');
    }, []);

    useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'k' && event.metaKey) {
          event.preventDefault();
          setOpen((prev) => !prev);
          setQuery('');
        }
        if (event.key === 'Escape') {
          handleClose();
        }
      }
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);

    const filtered = applyFilter({ inputData: items, query });
    const groups = groupedData(filtered);
    const notFound = query && filtered.length === 0;

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="hidden lg:inline text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
            ⌘K
          </span>
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={handleClose}
              aria-hidden="true"
            />
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[120px] px-4">
              <div className="w-full max-w-[560px] bg-[var(--color-background)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[var(--color-text-muted)] shrink-0"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 text-lg bg-transparent outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                  />
                  <span className="text-xs text-[var(--color-text-secondary)] tracking-wider">
                    esc
                  </span>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-4">
                  {notFound ? (
                    <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">
                      No results found for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    Object.keys(groups)
                      .sort()
                      .map((group) => (
                        <div key={group} className="mb-2">
                          {group && (
                            <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                              {group}
                            </p>
                          )}
                          {groups[group].map((item) => (
                            <button
                              key={`${item.title}${item.path}`}
                              type="button"
                              onClick={() => {
                                onClickItem?.(item.path);
                                handleClose();
                              }}
                              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-left text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] rounded-[var(--radius-md)] transition-colors"
                            >
                              <span className="text-[var(--color-text-primary)]">{item.title}</span>
                              <span className="text-xs text-[var(--color-text-muted)] truncate">
                                {item.path}
                              </span>
                            </button>
                          ))}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

SearchbarInner.displayName = 'Searchbar';

export const Searchbar = memo(SearchbarInner);

export type { SearchItem } from './utils';
export { applyFilter, groupedData } from './utils';
