import type { ProductListItem } from '@/types/product';

import { ProductCard } from './product-card';

interface ProductGridProps {
  products: ProductListItem[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--cream-dark)] mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
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
        </div>
        <h3 className="text-heading-3 font-medium text-[var(--charcoal)] mb-2">
          No products found
        </h3>
        <p className="text-body text-[var(--slate)] max-w-md mx-auto">
          Try adjusting your search or filter to find what you are looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
