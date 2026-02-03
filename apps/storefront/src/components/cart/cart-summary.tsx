'use client';

import Link from 'next/link';

import { useCart } from '@/contexts/cart-context';
import { useStore } from '@/contexts/store-context';

interface CartSummaryProps {
  showCheckout?: boolean;
  onCheckout?: () => void;
}

function formatPrice(price: number, currency: string = 'NPR'): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function CartSummary({ showCheckout = true, onCheckout }: CartSummaryProps) {
  const { summary, closeDrawer } = useCart();
  const { store } = useStore();

  const currency = store?.settings?.currency || 'NPR';
  const freeShippingThreshold = 2000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - summary.subtotal);
  const hasFreeShipping = summary.subtotal >= freeShippingThreshold;

  return (
    <div className="space-y-4">
      {summary.subtotal > 0 && (
        <div className="p-3 bg-[var(--cream-dark)] rounded-lg">
          {hasFreeShipping ? (
            <p className="text-body-sm text-[var(--sage)] font-medium text-center">
              You qualify for free shipping!
            </p>
          ) : (
            <p className="text-body-sm text-[var(--graphite)] text-center">
              Add {formatPrice(amountToFreeShipping, currency)} more for free shipping
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-body">
          <span className="text-[var(--graphite)]">
            Subtotal ({summary.totalItems} {summary.totalItems === 1 ? 'item' : 'items'})
          </span>
          <span className="font-semibold text-[var(--charcoal)]">
            {formatPrice(summary.subtotal, currency)}
          </span>
        </div>
        <p className="text-caption text-[var(--slate)]">
          Shipping and taxes calculated at checkout
        </p>
      </div>

      {showCheckout && (
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={onCheckout}
            disabled={summary.itemCount === 0}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
          <Link
            href="/cart"
            onClick={closeDrawer}
            className="block text-center text-body-sm font-medium text-[var(--coral)] hover:text-[var(--coral-dark)] link-underline transition-colors"
          >
            View Cart
          </Link>
        </div>
      )}
    </div>
  );
}
