'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import { CartDrawer } from '@/components/cart';
import { useCart } from '@/contexts/cart-context';
import { useStore } from '@/contexts/store-context';

import { MobileNav } from './mobile-nav';

interface CartButtonProps {
  count: number;
  onClick: () => void;
}

function CartButton({ count, onClick }: CartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-[var(--store-primary)]/10 transition-colors"
      aria-label={`Shopping cart with ${count} items`}
    >
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
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-[var(--store-primary)] text-white text-xs font-medium rounded-full px-1">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

function MenuIcon() {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
];

export function Header() {
  const { store } = useStore();
  const { summary, openDrawer, isHydrated } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = isHydrated ? summary.totalItems : 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--mist)]/20">
        <div className="container-main">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              {store?.logo ? (
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[var(--store-primary)] flex items-center justify-center">
                  <span className="text-white font-display font-semibold text-lg">
                    {store?.name?.charAt(0) || 'S'}
                  </span>
                </div>
              )}
              <span className="text-lg font-semibold tracking-tight hidden sm:block">
                {store?.name || 'Store'}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body-sm font-medium text-[var(--graphite)] hover:text-[var(--foreground)] link-underline transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <CartButton count={cartItemCount} onClick={openDrawer} />

              <button
                type="button"
                className="md:hidden p-2 rounded-full hover:bg-[var(--store-primary)]/10 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={NAV_LINKS}
        storeName={store?.name}
        storeLogo={store?.logo}
      />

      <CartDrawer />
    </>
  );
}
