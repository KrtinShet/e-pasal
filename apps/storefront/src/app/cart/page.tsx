'use client';

import Link from 'next/link';

import { useCart } from '@/contexts/cart-context';
import { useStore } from '@/contexts/store-context';
import { CartItem, CartSummary } from '@/components/cart';

function ChevronLeftIcon() {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--grey-300)]"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function TrashIcon() {
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
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function formatPrice(price: number, currency: string = 'NPR'): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CartIcon />
      <h2 className="mt-6 text-heading-2 font-display font-semibold text-[var(--grey-900)]">
        Your cart is empty
      </h2>
      <p className="mt-3 text-body-lg text-[var(--grey-700)] max-w-md">
        Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
      </p>
      <Link href="/products" className="mt-8 btn-primary">
        Browse Products
      </Link>
    </div>
  );
}

function CartPageSkeleton() {
  return (
    <div className="container-main py-8 md:py-12">
      <div className="h-8 w-48 bg-[var(--grey-100)] rounded animate-pulse" />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-[var(--grey-100)] rounded-lg animate-pulse">
              <div className="w-20 h-20 bg-[var(--grey-300)]/30 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 bg-[var(--grey-300)]/30 rounded" />
                <div className="h-4 w-1/2 bg-[var(--grey-300)]/30 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-64 bg-[var(--grey-100)] rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, isHydrated, clearCart, summary } = useCart();
  const { store } = useStore();

  const currency = store?.settings?.currency || 'NPR';

  const handleCheckout = () => {
    // TODO: Implement checkout navigation
    console.log('Proceeding to checkout...');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (!isHydrated) {
    return <CartPageSkeleton />;
  }

  return (
    <div className="container-main py-8 md:py-12">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-body-sm text-[var(--grey-600)] hover:text-[var(--grey-900)] transition-colors"
        >
          <ChevronLeftIcon />
          Continue Shopping
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-heading-1 font-display font-semibold text-[var(--grey-900)]">
          Shopping Cart
          {summary.totalItems > 0 && (
            <span className="ml-3 text-heading-3 text-[var(--grey-600)] font-normal">
              ({summary.totalItems} {summary.totalItems === 1 ? 'item' : 'items'})
            </span>
          )}
        </h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-body-sm font-medium text-[var(--store-primary)] hover:text-[var(--store-primary-dark)] hover:bg-[var(--grey-100)] rounded-lg transition-colors"
          >
            <TrashIcon />
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="card p-0">
              <div className="divide-y divide-[var(--grey-300)]/20">
                {items.map((item) => (
                  <div key={`${item.productId}:${item.variantId || 'default'}`} className="px-4">
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-body">
              <span className="text-[var(--grey-700)]">Subtotal:</span>
              <span className="text-heading-3 font-semibold text-[var(--grey-900)]">
                {formatPrice(summary.subtotal, currency)}
              </span>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-heading-3 font-semibold text-[var(--grey-900)] mb-6">
                Order Summary
              </h2>
              <CartSummary showCheckout onCheckout={handleCheckout} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
