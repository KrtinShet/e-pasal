'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';
import {
  InlineText,
  InlineImage,
  InlineNumber,
  useSectionEditor,
  InlineItemActions,
  InlineListToolbar,
  EditableElement,
} from '../../renderer';

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

function ProductCard({
  product,
  index,
  total,
}: {
  product: ProductItem;
  index: number;
  total: number;
}) {
  const { editMode, removeAt, moveItem } = useSectionEditor();
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <a
      href={product.slug ? `/products/${product.slug}` : '#'}
      className="group block rounded-lg bg-[var(--color-background)] transition-shadow hover:shadow-md"
    >
      {editMode && (
        <div className="mb-2">
          <InlineItemActions
            onMoveUp={index > 0 ? () => moveItem('products', index, index - 1) : undefined}
            onMoveDown={
              index < total - 1 ? () => moveItem('products', index, index + 1) : undefined
            }
            onDelete={() => removeAt('products', index)}
          />
        </div>
      )}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-[var(--color-surface)]">
        {product.image ? (
          <InlineImage
            srcPath={`products.${index}.image`}
            src={product.image}
            altPath={`products.${index}.name`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            placeholderClassName="h-full w-full"
          />
        ) : (
          <>
            {editMode ? (
              <InlineImage
                srcPath={`products.${index}.image`}
                src={product.image}
                altPath={`products.${index}.name`}
                alt={product.name}
                placeholderClassName="h-full w-full"
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
          </>
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-[var(--color-error)] px-2 py-0.5 text-xs font-semibold text-white">
            Sale
          </span>
        )}
      </div>
      <div className="p-4">
        <InlineText
          path={`products.${index}.name`}
          value={product.name}
          as="h3"
          className="truncate font-medium text-[var(--color-text-primary)]"
        />
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-[var(--color-primary)]">
            Rs. <InlineNumber path={`products.${index}.price`} value={product.price} />
          </span>
          {hasDiscount && (
            <span className="text-sm text-[var(--color-text-muted)] line-through">
              Rs.{' '}
              <InlineNumber
                path={`products.${index}.compareAtPrice`}
                value={product.compareAtPrice!}
              />
            </span>
          )}
        </div>
        {editMode && (
          <InlineText
            path={`products.${index}.slug`}
            value={product.slug}
            as="p"
            className="mt-1 text-xs text-[var(--color-text-muted)]"
            placeholder="/products/slug"
          />
        )}
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
  const { editMode, append, setPath } = useSectionEditor();
  const displayProducts = limit ? products.slice(0, limit) : products;
  const isEmpty = displayProducts.length === 0;

  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        {editMode && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] shadow-sm">
              Columns
              <select
                value={String(columns)}
                onChange={(event) => setPath('columns', Number(event.target.value))}
                className="bg-transparent text-[var(--color-text-primary)] outline-none"
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>
            {typeof limit === 'number' ? (
              <InlineNumber path="limit" value={limit} min={1} max={24} />
            ) : null}
            <InlineListToolbar
              label="Add product"
              onAdd={() =>
                append('products', {
                  id: `product-${Date.now()}`,
                  name: 'New Product',
                  price: 0,
                  slug: '',
                  image: '',
                })
              }
            />
          </div>
        )}

        {title && (
          <EditableElement path="title">
            <InlineText
              path="title"
              value={title}
              as="h2"
              className="mb-8 text-center font-display text-3xl font-bold text-[var(--color-text-primary)]"
            />
          </EditableElement>
        )}
        <div className={cn('grid gap-6', columnClasses[columns])}>
          {isEmpty
            ? Array.from({ length: columns }).map((_, i) => <ProductPlaceholder key={i} />)
            : displayProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  total={displayProducts.length}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
