'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useTransition } from 'react';

import type { Category, SortOption } from '@/types/product';

interface ProductFiltersProps {
  categories: Category[];
  totalProducts: number;
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--slate)]"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export function ProductFilters({ categories, totalProducts }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = (searchParams.get('sort') as SortOption) || 'newest';

  const [searchValue, setSearchValue] = useState(currentSearch);

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      params.delete('page');

      startTransition(() => {
        router.push(`/products?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== currentSearch) {
        updateParams({ search: searchValue || null });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue, currentSearch, updateParams]);

  const handleCategoryChange = (categoryId: string) => {
    updateParams({ category: categoryId || null });
  };

  const handleSortChange = (sort: SortOption) => {
    updateParams({ sort: sort === 'newest' ? null : sort });
  };

  const clearFilters = () => {
    setSearchValue('');
    startTransition(() => {
      router.push('/products', { scroll: false });
    });
  };

  const hasActiveFilters = currentCategory || currentSearch || currentSort !== 'newest';

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[var(--ivory)] border border-[var(--mist)]/30 rounded-xl text-body placeholder:text-[var(--slate)] focus:outline-none focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/20 transition-all"
          aria-label="Search products"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--cream-dark)] rounded-full transition-colors"
            aria-label="Clear search"
          >
            <XIcon />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {categories.length > 0 && (
          <div className="relative">
            <select
              value={currentCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-[var(--ivory)] border border-[var(--mist)]/30 rounded-full text-body-sm cursor-pointer hover:border-[var(--slate)] focus:outline-none focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/20 transition-all"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDownIcon />
            </div>
          </div>
        )}

        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-[var(--ivory)] border border-[var(--mist)]/30 rounded-full text-body-sm cursor-pointer hover:border-[var(--slate)] focus:outline-none focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/20 transition-all"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2.5 text-body-sm text-[var(--coral)] hover:text-[var(--coral-dark)] hover:bg-[var(--peach-light)] rounded-full transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex items-center justify-between py-2 border-b border-[var(--mist)]/20">
        <p className="text-body-sm text-[var(--slate)]">
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-[var(--coral)] border-t-transparent rounded-full animate-spin" />
              Loading...
            </span>
          ) : (
            <>
              Showing <span className="font-medium text-[var(--charcoal)]">{totalProducts}</span>{' '}
              {totalProducts === 1 ? 'product' : 'products'}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
