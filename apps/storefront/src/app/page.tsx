'use client';

import Link from 'next/link';

import { useStore } from '@/contexts/store-context';

function ArrowRightIcon() {
  return (
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function WelcomeContent() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-main text-center">
        <span className="badge mb-6 opacity-0 animate-fade-in-up">Welcome to Baazarify</span>
        <h1 className="text-display-2 font-display mb-6 opacity-0 animate-fade-in-up delay-100">
          <span className="text-gradient">Start Shopping</span>
        </h1>
        <p className="text-body-lg text-[var(--muted)] max-w-xl mx-auto mb-8 opacity-0 animate-fade-in-up delay-200">
          Add a store parameter to start browsing. Try adding{' '}
          <code className="px-2 py-1 bg-[var(--cream-dark)] rounded font-mono text-sm">
            ?store=demo
          </code>{' '}
          to the URL.
        </p>
        <div className="opacity-0 animate-fade-in-up delay-300">
          <a href="https://baazarify.com" className="btn-primary">
            Create Your Store
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </section>
  );
}

function StoreContent({
  storeName,
  storeDescription,
}: {
  storeName: string;
  storeDescription?: string;
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        <div className="text-center mb-12 md:mb-16">
          <span className="badge mb-6 opacity-0 animate-fade-in-up">Welcome</span>
          <h1 className="text-display-2 font-display mb-6 opacity-0 animate-fade-in-up delay-100">
            <span className="text-gradient">{storeName}</span>
          </h1>
          {storeDescription && (
            <p className="text-body-lg text-[var(--muted)] max-w-2xl mx-auto opacity-0 animate-fade-in-up delay-200">
              {storeDescription}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up delay-300">
          <Link href="/products" className="btn-primary">
            Browse Products
            <ArrowRightIcon />
          </Link>
          <Link href="/cart" className="btn-secondary">
            View Cart
          </Link>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-8 text-center opacity-0 animate-fade-in-up delay-400">
            <div className="w-12 h-12 rounded-full bg-[var(--peach-light)] flex items-center justify-center mx-auto mb-4">
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
                className="text-[var(--coral)]"
              >
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <h3 className="text-heading-3 font-semibold mb-2">Quality Products</h3>
            <p className="text-body-sm text-[var(--muted)]">
              Discover our curated selection of high-quality items.
            </p>
          </div>

          <div className="card p-8 text-center opacity-0 animate-fade-in-up delay-500">
            <div className="w-12 h-12 rounded-full bg-[var(--peach-light)] flex items-center justify-center mx-auto mb-4">
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
                className="text-[var(--coral)]"
              >
                <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                <path d="m7.5 4.27 9 5.15" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" x2="12" y1="22" y2="12" />
                <circle cx="18.5" cy="15.5" r="2.5" />
                <path d="M20.27 17.27 22 19" />
              </svg>
            </div>
            <h3 className="text-heading-3 font-semibold mb-2">Easy Ordering</h3>
            <p className="text-body-sm text-[var(--muted)]">
              Simple checkout process with multiple payment options.
            </p>
          </div>

          <div className="card p-8 text-center opacity-0 animate-fade-in-up delay-600">
            <div className="w-12 h-12 rounded-full bg-[var(--peach-light)] flex items-center justify-center mx-auto mb-4">
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
                className="text-[var(--coral)]"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h3 className="text-heading-3 font-semibold mb-2">Customer Support</h3>
            <p className="text-body-sm text-[var(--muted)]">
              We are here to help with any questions or concerns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { store } = useStore();

  if (!store) {
    return <WelcomeContent />;
  }

  return <StoreContent storeName={store.name} storeDescription={store.description} />;
}
