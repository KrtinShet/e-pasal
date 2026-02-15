'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';

import { useCart } from '@/contexts/cart-context';

import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CartIcon() {
  return (
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
      className="text-[var(--grey-300)]"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <CartIcon />
      <h3 className="mt-4 text-heading-3 font-medium text-[var(--grey-900)]">Your cart is empty</h3>
      <p className="mt-2 text-body text-[var(--grey-700)]">Add some products to get started</p>
      <Link href="/products" onClick={onClose} className="mt-6 btn-primary">
        Browse Products
      </Link>
    </div>
  );
}

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, summary, isHydrated } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (isDrawerOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeDrawer();
    }
  };

  const handleCheckout = () => {
    closeDrawer();
    window.location.href = '/checkout';
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[var(--background)] shadow-xl transform transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--grey-300)]/20">
            <h2 className="text-heading-3 font-semibold text-[var(--grey-900)]">
              Your Cart
              {summary.totalItems > 0 && (
                <span className="ml-2 text-body text-[var(--grey-600)] font-normal">
                  ({summary.totalItems})
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={closeDrawer}
              className="p-2 rounded-full hover:bg-[var(--grey-100)] transition-colors"
              aria-label="Close cart"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Content */}
          {items.length === 0 ? (
            <EmptyCart onClose={closeDrawer} />
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto px-4">
                <div className="py-2">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.productId}:${item.variantId || 'default'}`}
                      item={item}
                    />
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="px-4 py-4 border-t border-[var(--grey-300)]/20 bg-[var(--background)]">
                <CartSummary showCheckout onCheckout={handleCheckout} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
