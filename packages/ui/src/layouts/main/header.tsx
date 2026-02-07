'use client';

import { useState, forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';
import { HEADER } from '../../styles/config-layout';
import { HeaderShadow } from '../common/header-shadow';
import { useOffSetTop } from '../../hooks/use-off-set-top';
import type { NavBasicItemBaseProps } from '../../components/nav-basic';
import { NavBasicMobile, NavBasicDesktop } from '../../components/nav-basic';

export interface MainHeaderProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  navData?: NavBasicItemBaseProps[];
  action?: ReactNode;
  loginButton?: ReactNode;
}

export const MainHeader = forwardRef<HTMLElement, MainHeaderProps>(
  ({ className, logo, navData = [], action, loginButton, ...props }, ref) => {
    const offsetTop = useOffSetTop(HEADER.H_DESKTOP);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
      <header ref={ref} className={cn('sticky top-0 z-30', className)} {...props}>
        <div
          style={{
            height: HEADER.H_DESKTOP,
          }}
          className={cn(
            'flex items-center transition-all duration-200',
            offsetTop
              ? 'bg-[color-mix(in_srgb,var(--color-background)_80%,transparent)] backdrop-blur-xl'
              : 'bg-transparent'
          )}
        >
          <div className="mx-auto flex h-full w-full max-w-[1200px] items-center px-4 md:px-6">
            {logo && <div className="mr-6 shrink-0">{logo}</div>}

            <div className="flex-1" />

            <nav className="hidden md:block">
              <NavBasicDesktop data={navData} />
            </nav>

            <div className="flex items-center gap-2 md:flex-row-reverse">
              {action}
              {loginButton && <div className="hidden md:block">{loginButton}</div>}

              <button
                type="button"
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] md:hidden',
                  'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]',
                  'transition-colors duration-[var(--transition-fast)]'
                )}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {offsetTop && <HeaderShadow />}

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 right-0 z-50 w-[280px] bg-[var(--color-background)] shadow-[var(--shadow-lg)] md:hidden">
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                {logo}
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
                  aria-label="Close menu"
                >
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
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <NavBasicMobile data={navData} />
              </div>
            </div>
          </>
        )}
      </header>
    );
  }
);

MainHeader.displayName = 'MainHeader';
