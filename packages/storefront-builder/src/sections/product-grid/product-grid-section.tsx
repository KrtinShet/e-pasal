'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
  compareAtPrice?: number;
}

export interface ProductGridSectionProps extends BaseSectionProps {
  title?: string;
  products: ProductItem[];
  columns?: 2 | 3 | 4;
  limit?: number;
}

function ProductPlaceholder() {
  return (
    <div className="animate-pulse rounded-lg bg-[var(--color-surface)] p-4">
      <div className="aspect-square rounded-md bg-[var(--color-border)]" />
      <div className="mt-4 h-4 w-3/4 rounded bg-[var(--color-border)]" />
      <div className="mt-2 h-4 w-1/2 rounded bg-[var(--color-border)]" />
    </div>
  );
}

function ProductCard({ product }: { product: ProductItem }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <a
      href={product.slug ? `/products/${product.slug}` : '#'}
      className="group block rounded-lg bg-[var(--color-background)] transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-[var(--color-surface)]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-[var(--color-error)] px-2 py-0.5 text-xs font-semibold text-white">
            Sale
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate font-medium text-[var(--color-text-primary)]">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-[var(--color-primary)]">
            Rs. {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[var(--color-text-muted)] line-through">
              Rs. {product.compareAtPrice!.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export function ProductGridSection({
  className,
  title,
  products,
  columns = 4,
  limit,
}: ProductGridSectionProps) {
  const displayProducts = limit ? products.slice(0, limit) : products;
  const isEmpty = displayProducts.length === 0;

  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        {title && (
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-[var(--color-text-primary)]">
            {title}
          </h2>
        )}
        <div className={cn('grid gap-6', columnClasses[columns])}>
          {isEmpty
            ? Array.from({ length: columns }).map((_, i) => <ProductPlaceholder key={i} />)
            : displayProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
