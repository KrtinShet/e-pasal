'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import { useCart } from '@/contexts/cart-context';
import { useStore } from '@/contexts/store-context';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  onRemoveConfirm?: () => void;
}

function MinusIcon() {
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
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
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

export function CartItem({ item, onRemoveConfirm }: CartItemProps) {
  const { updateQuantity, removeItem, closeDrawer } = useCart();
  const { store } = useStore();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const currency = store?.settings?.currency || 'NPR';
  const lineTotal = item.price * item.quantity;
  const hasDiscount = item.compareAtPrice && item.compareAtPrice > item.price;

  const handleIncrement = () => {
    if (item.quantity < item.maxQuantity) {
      updateQuantity(item.productId, item.quantity + 1, item.variantId);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1, item.variantId);
    } else {
      setShowRemoveConfirm(true);
    }
  };

  const handleRemove = () => {
    removeItem(item.productId, item.variantId);
    setShowRemoveConfirm(false);
    onRemoveConfirm?.();
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirm(false);
  };

  if (showRemoveConfirm) {
    return (
      <div className="flex items-center justify-between p-4 bg-[var(--cream-dark)] rounded-lg">
        <p className="text-body-sm text-[var(--charcoal)]">Remove this item?</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancelRemove}
            className="px-3 py-1.5 text-body-sm font-medium text-[var(--slate)] hover:text-[var(--charcoal)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="px-3 py-1.5 text-body-sm font-medium text-white bg-[var(--coral)] hover:bg-[var(--coral-dark)] rounded-lg transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--mist)]/20 last:border-b-0">
      <Link
        href={`/products/${item.slug}`}
        onClick={closeDrawer}
        className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-[var(--cream-dark)]"
      >
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              onClick={closeDrawer}
              className="text-body font-medium text-[var(--charcoal)] hover:text-[var(--coral)] line-clamp-2 transition-colors"
            >
              {item.name}
            </Link>
            {item.variantName && (
              <p className="text-caption text-[var(--slate)] mt-0.5">{item.variantName}</p>
            )}
            {item.sku && <p className="text-caption text-[var(--slate)]">SKU: {item.sku}</p>}
          </div>
          <button
            type="button"
            onClick={() => setShowRemoveConfirm(true)}
            className="p-1.5 text-[var(--slate)] hover:text-[var(--coral)] transition-colors shrink-0"
            aria-label={`Remove ${item.name} from cart`}
          >
            <TrashIcon />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex items-center border border-[var(--mist)]/30 rounded-lg">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-8 h-8 flex items-center justify-center text-[var(--graphite)] hover:text-[var(--charcoal)] hover:bg-[var(--cream-dark)] rounded-l-lg transition-colors"
              aria-label="Decrease quantity"
            >
              <MinusIcon />
            </button>
            <span className="w-10 text-center text-body-sm font-medium text-[var(--charcoal)]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={item.quantity >= item.maxQuantity}
              className="w-8 h-8 flex items-center justify-center text-[var(--graphite)] hover:text-[var(--charcoal)] hover:bg-[var(--cream-dark)] rounded-r-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <PlusIcon />
            </button>
          </div>

          <div className="text-right">
            <p className="text-body font-semibold text-[var(--charcoal)]">
              {formatPrice(lineTotal, currency)}
            </p>
            {hasDiscount && (
              <p className="text-caption text-[var(--slate)] line-through">
                {formatPrice(item.compareAtPrice! * item.quantity, currency)}
              </p>
            )}
          </div>
        </div>

        {item.quantity >= item.maxQuantity && (
          <p className="mt-2 text-caption text-[var(--coral)]">Max quantity reached</p>
        )}
      </div>
    </div>
  );
}
