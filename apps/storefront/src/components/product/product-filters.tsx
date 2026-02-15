'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useTransition } from 'react';

import type { Category, SortOption } from '@/types/product';
import { CustomSelect } from '@/components/ui/custom-select';

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
      className="text-[var(--grey-600)]"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
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

  const handleSortChange = (sort: string) => {
    updateParams({ sort: sort === 'newest' ? null : sort });
  };

  const clearFilters = () => {
    setSearchValue('');
    startTransition(() => {
      router.push('/products', { scroll: false });
    });
  };

  const hasActiveFilters = currentCategory || currentSearch || currentSort !== 'newest';

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
  ];

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
          className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--store-primary)]/20 rounded-xl text-body placeholder:text-[var(--grey-600)] focus:outline-none focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/20 transition-all"
          aria-label="Search products"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--store-primary)]/10 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <XIcon />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {categories.length > 0 && (
          <CustomSelect
            options={categoryOptions}
            value={currentCategory}
            onChange={handleCategoryChange}
            aria-label="Filter by category"
          />
        )}

        <CustomSelect
          options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={currentSort}
          onChange={handleSortChange}
          aria-label="Sort products"
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2.5 text-body-sm text-[var(--store-primary)] hover:text-[var(--store-primary-dark)] hover:bg-[var(--store-primary)]/10 rounded-full transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex items-center justify-between py-2 border-b border-[var(--store-primary)]/10">
        <p className="text-body-sm text-[var(--grey-600)]">
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-[var(--store-primary)] border-t-transparent rounded-full animate-spin" />
              Loading...
            </span>
          ) : (
            <>
              Showing <span className="font-medium text-[var(--foreground)]">{totalProducts}</span>{' '}
              {totalProducts === 1 ? 'product' : 'products'}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
