'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useStore } from '@/contexts/store-context';
import type { ProductListItem } from '@/types/product';

interface ProductCardProps {
  product: ProductListItem;
}

function formatPrice(price: number, currency: string = 'NPR'): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function ProductCard({ product }: ProductCardProps) {
  const { store } = useStore();
  const currency = store?.settings?.currency || 'NPR';

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      aria-label={`View ${product.name}`}
    >
      <article className="card overflow-hidden">
        <div className="relative aspect-square bg-[var(--cream-dark)] overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--mist)]"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}

          {hasDiscount && (
            <span className="absolute top-3 left-3 badge bg-[var(--store-primary)] text-white">
              -{discountPercentage}%
            </span>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-[var(--charcoal)]/40 flex items-center justify-center">
              <span className="bg-white/90 text-[var(--charcoal)] px-4 py-2 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-body font-medium text-[var(--charcoal)] line-clamp-2 min-h-[3.4em] group-hover:text-[var(--store-primary)] transition-colors">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-heading-3 font-semibold text-[var(--charcoal)]">
              {formatPrice(product.price, currency)}
            </span>
            {hasDiscount && (
              <span className="text-body-sm text-[var(--slate)] line-through">
                {formatPrice(product.compareAtPrice!, currency)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
