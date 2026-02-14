'use client';

import Link from 'next/link';

import { useStore } from '@/contexts/store-context';

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
];

export function Footer() {
  const { store } = useStore();
  const currentYear = new Date().getFullYear();

  const hasSocialLinks =
    store?.social?.facebook || store?.social?.instagram || store?.social?.tiktok;

  return (
    <footer className="bg-[var(--store-primary)]/5 border-t border-[var(--mist)]/20">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="text-heading-3 font-display">{store?.name || 'Store'}</h3>
            {store?.description && (
              <p className="text-body-sm text-[var(--muted)] max-w-sm">{store.description}</p>
            )}

            {store?.contact && (
              <div className="space-y-2 text-body-sm text-[var(--muted)]">
                {store.contact.email && (
                  <p>
                    <a
                      href={`mailto:${store.contact.email}`}
                      className="hover:text-[var(--foreground)] transition-colors"
                    >
                      {store.contact.email}
                    </a>
                  </p>
                )}
                {store.contact.phone && (
                  <p>
                    <a
                      href={`tel:${store.contact.phone}`}
                      className="hover:text-[var(--foreground)] transition-colors"
                    >
                      {store.contact.phone}
                    </a>
                  </p>
                )}
                {store.contact.address && <p>{store.contact.address}</p>}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-body font-semibold mb-4">Quick Links</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {hasSocialLinks && (
            <div>
              <h4 className="text-body font-semibold mb-4">Follow Us</h4>
              <div className="flex items-center gap-3">
                {store?.social?.facebook && (
                  <a
                    href={store.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[var(--store-primary)]/10 hover:bg-[var(--store-primary)]/20 text-[var(--graphite)] hover:text-[var(--foreground)] transition-colors"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                )}
                {store?.social?.instagram && (
                  <a
                    href={store.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[var(--store-primary)]/10 hover:bg-[var(--store-primary)]/20 text-[var(--graphite)] hover:text-[var(--foreground)] transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {store?.social?.tiktok && (
                  <a
                    href={store.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[var(--store-primary)]/10 hover:bg-[var(--store-primary)]/20 text-[var(--graphite)] hover:text-[var(--foreground)] transition-colors"
                    aria-label="TikTok"
                  >
                    <TikTokIcon />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="divider my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-[var(--muted)]">
          <p>
            &copy; {currentYear} {store?.name || 'Store'}. All rights reserved.
          </p>
          <p>
            Powered by{' '}
            <a
              href="https://baazarify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--store-primary)] hover:underline"
            >
              Baazarify
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
