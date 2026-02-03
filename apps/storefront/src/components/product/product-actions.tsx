'use client';

import type { Product } from '@/types/product';
import { AddToCartButton } from '@/components/cart';

interface ProductActionsProps {
  product: Product;
  isInStock: boolean;
}

export function ProductActions({ product, isInStock }: ProductActionsProps) {
  if (!isInStock) {
    return (
      <div className="pt-4 border-t border-[var(--mist)]/20">
        <button
          type="button"
          disabled
          className="btn-primary w-full opacity-50 cursor-not-allowed"
          aria-label="Out of stock"
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
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          Out of Stock
        </button>
        <p className="mt-3 text-caption text-[var(--slate)] text-center">
          Free shipping on orders over NPR 2,000
        </p>
      </div>
    );
  }

  return (
    <div className="pt-4 border-t border-[var(--mist)]/20">
      <AddToCartButton product={product} showQuantity size="lg" className="w-full" />
      <p className="mt-3 text-caption text-[var(--slate)] text-center">
        Free shipping on orders over NPR 2,000
      </p>
    </div>
  );
}
