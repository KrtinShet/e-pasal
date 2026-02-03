'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect } from 'react';

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  storeName?: string;
  storeLogo?: string;
}

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

export function MobileNav({ isOpen, onClose, links, storeName, storeLogo }: MobileNavProps) {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && navRef.current) {
      const focusableElements = navRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      function handleTabKey(event: KeyboardEvent) {
        if (event.key !== 'Tab') return;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
    return undefined;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" id="mobile-menu">
      <div
        className="fixed inset-0 bg-[var(--charcoal)]/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={navRef}
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-[var(--background)] shadow-xl animate-slide-right"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--mist)]/20">
            <div className="flex items-center gap-3">
              {storeLogo ? (
                <Image
                  src={storeLogo}
                  alt={storeName || 'Store'}
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[var(--coral)] flex items-center justify-center">
                  <span className="text-white font-display font-semibold">
                    {storeName?.charAt(0) || 'S'}
                  </span>
                </div>
              )}
              <span className="font-semibold">{storeName || 'Store'}</span>
            </div>

            <button
              type="button"
              className="p-2 rounded-full hover:bg-[var(--cream-dark)] transition-colors"
              onClick={onClose}
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile navigation">
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center px-4 py-3 text-lg font-medium rounded-xl hover:bg-[var(--cream-dark)] transition-colors"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-6 py-6 border-t border-[var(--mist)]/20">
            <p className="text-caption text-[var(--muted)]">
              Powered by{' '}
              <a
                href="https://baazarify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--coral)] hover:underline"
              >
                Baazarify
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
