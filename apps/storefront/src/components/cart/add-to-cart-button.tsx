'use client';

import { useState, useCallback } from 'react';

import { useCart } from '@/contexts/cart-context';
import type { Product, ProductListItem } from '@/types/product';

interface AddToCartButtonProps {
  product: Product | ProductListItem;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showQuantity?: boolean;
  className?: string;
}

function CartIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function CheckIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
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

export function AddToCartButton({
  product,
  variant = 'primary',
  size = 'md',
  showQuantity = false,
  className = '',
}: AddToCartButtonProps) {
  const { addItem, getItemQuantity, updateQuantity, openDrawer } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stock <= 0;
  const cartQuantity = getItemQuantity(product._id);
  const maxQuantity = product.stock;
  const canAddMore = cartQuantity < maxQuantity;

  const handleAddToCart = useCallback(() => {
    if (isOutOfStock || !canAddMore) return;

    setIsAdding(true);

    const itemToAdd = {
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0],
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      maxQuantity: product.stock,
      sku: 'sku' in product ? product.sku : undefined,
      quantity: showQuantity ? quantity : 1,
    };

    addItem(itemToAdd);
    openDrawer();

    setTimeout(() => {
      setIsAdding(false);
      if (showQuantity) {
        setQuantity(1);
      }
    }, 1000);
  }, [product, isOutOfStock, canAddMore, addItem, openDrawer, showQuantity, quantity]);

  const handleUpdateQuantity = useCallback(
    (newQuantity: number) => {
      updateQuantity(product._id, newQuantity);
    },
    [product._id, updateQuantity]
  );

  const sizeClasses = {
    sm: 'text-body-sm px-3 py-1.5',
    md: 'text-body px-4 py-2.5',
    lg: 'text-body-lg px-6 py-3',
  };

  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToCart();
        }}
        disabled={isOutOfStock || !canAddMore || isAdding}
        className={`p-2 rounded-full bg-[var(--background)] text-[var(--charcoal)] hover:bg-[var(--cream-dark)] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
      >
        {isAdding ? <CheckIcon size={iconSizeMap[size]} /> : <CartIcon size={iconSizeMap[size]} />}
      </button>
    );
  }

  if (cartQuantity > 0 && showQuantity) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center border border-[var(--mist)]/30 rounded-lg">
          <button
            type="button"
            onClick={() => handleUpdateQuantity(cartQuantity - 1)}
            className="w-10 h-10 flex items-center justify-center text-[var(--graphite)] hover:text-[var(--charcoal)] hover:bg-[var(--cream-dark)] rounded-l-lg transition-colors"
            aria-label="Decrease quantity"
          >
            <MinusIcon />
          </button>
          <span className="w-12 text-center text-body font-medium text-[var(--charcoal)]">
            {cartQuantity}
          </span>
          <button
            type="button"
            onClick={() => handleUpdateQuantity(cartQuantity + 1)}
            disabled={cartQuantity >= maxQuantity}
            className="w-10 h-10 flex items-center justify-center text-[var(--graphite)] hover:text-[var(--charcoal)] hover:bg-[var(--cream-dark)] rounded-r-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <PlusIcon />
          </button>
        </div>
        <span className="text-body-sm text-[var(--slate)]">in cart</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showQuantity && (
        <div className="flex items-center border border-[var(--mist)]/30 rounded-lg">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center text-[var(--graphite)] hover:text-[var(--charcoal)] hover:bg-[var(--cream-dark)] rounded-l-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <MinusIcon />
          </button>
          <span className="w-12 text-center text-body font-medium text-[var(--charcoal)]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(maxQuantity - cartQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity - cartQuantity}
            className="w-10 h-10 flex items-center justify-center text-[var(--graphite)] hover:text-[var(--charcoal)] hover:bg-[var(--cream-dark)] rounded-r-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <PlusIcon />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || !canAddMore || isAdding}
        className={`
          inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all
          ${sizeClasses[size]}
          ${
            variant === 'primary'
              ? 'bg-[var(--coral)] text-white hover:bg-[var(--coral-dark)]'
              : 'bg-[var(--cream-dark)] text-[var(--charcoal)] hover:bg-[var(--mist)]/30'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isAdding ? 'bg-[var(--sage)] hover:bg-[var(--sage)]' : ''}
          ${showQuantity ? 'flex-1' : ''}
        `}
        aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
      >
        {isAdding ? (
          <>
            <CheckIcon size={iconSizeMap[size]} />
            Added!
          </>
        ) : (
          <>
            <CartIcon size={iconSizeMap[size]} />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </>
        )}
      </button>
    </div>
  );
}
