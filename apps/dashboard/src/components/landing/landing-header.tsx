'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'bg-[var(--cream)]/95 backdrop-blur-md shadow-[var(--shadow-sm)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-[var(--charcoal)]">
              Baazarify
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-body-sm font-medium text-[var(--slate)] hover:text-[var(--charcoal)] transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-body-sm font-medium text-[var(--slate)] hover:text-[var(--charcoal)] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-body-sm font-medium text-[var(--slate)] hover:text-[var(--charcoal)] transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-body-sm font-medium text-[var(--slate)] hover:text-[var(--charcoal)] transition-colors"
            >
              Testimonials
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-body-sm font-medium text-[var(--charcoal)] hover:text-[var(--coral)] transition-colors"
            >
              Log In
            </Link>
            <Link href="/register" className="btn-primary text-sm !py-2.5 !px-6">
              Get Started Free
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-6 border-t border-[var(--mist)]/20">
            <nav className="flex flex-col gap-1 pt-4">
              <a
                href="#features"
                className="px-4 py-2.5 text-body-sm font-medium text-[var(--slate)] hover:text-[var(--charcoal)] hover:bg-[var(--cream-dark)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-4 py-2.5 text-body-sm font-medium text-[var(--slate)] hover:text-[var(--charcoal)] hover:bg-[var(--cream-dark)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="px-4 py-2.5 text-body-sm font-medium text-[var(--slate)] hover:text-[var(--charcoal)] hover:bg-[var(--cream-dark)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="px-4 py-2.5 text-body-sm font-medium text-[var(--slate)] hover:text-[var(--charcoal)] hover:bg-[var(--cream-dark)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
            </nav>
            <div className="flex flex-col gap-2 mt-4 px-4">
              <Link
                href="/login"
                className="btn-secondary text-sm text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
