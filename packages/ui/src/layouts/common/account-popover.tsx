'use client';

import { useRef, useState, useEffect, forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface AccountPopoverOption {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface AccountPopoverProps extends HTMLAttributes<HTMLDivElement> {
  user: {
    displayName: string;
    email?: string;
    photoURL?: string;
  };
  options?: AccountPopoverOption[];
  onLogout?: () => void;
  as?: React.ElementType;
}

export const AccountPopover = forwardRef<HTMLDivElement, AccountPopoverProps>(
  ({ className, user, options = [], onLogout, as: LinkComponent = 'a', ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initials = user.displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div ref={popoverRef} className={cn('relative', className)} {...props}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            'transition-all duration-[var(--transition-fast)]',
            open
              ? 'bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)]'
              : 'bg-[color-mix(in_srgb,var(--color-text-secondary)_8%,transparent)]'
          )}
          aria-expanded={open}
          aria-haspopup="true"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-9 h-9 rounded-full object-cover border-2 border-[var(--color-background)]"
            />
          ) : (
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {initials}
            </span>
          )}
        </button>

        {open && (
          <div
            className={cn(
              'absolute right-0 top-full mt-1 w-[200px] py-0',
              'bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-lg)]',
              'shadow-[var(--shadow-lg)] z-50'
            )}
            role="menu"
          >
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                {user.displayName}
              </p>
              {user.email && (
                <p className="text-xs text-[var(--color-text-secondary)] truncate">{user.email}</p>
              )}
            </div>

            <div className="border-t border-dashed border-[var(--color-border)]" />

            <div className="p-1">
              {options.map((option) =>
                option.href ? (
                  <LinkComponent
                    key={option.label}
                    href={option.href}
                    className="flex w-full px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] rounded-[var(--radius-sm)] transition-colors"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    {option.label}
                  </LinkComponent>
                ) : (
                  <button
                    key={option.label}
                    type="button"
                    className="flex w-full px-3 py-2 text-sm text-left text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] rounded-[var(--radius-sm)] transition-colors"
                    role="menuitem"
                    onClick={() => {
                      option.onClick?.();
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                )
              )}
            </div>

            <div className="border-t border-dashed border-[var(--color-border)]" />

            <div className="p-1">
              <button
                type="button"
                className="flex w-full px-3 py-2 text-sm font-bold text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] rounded-[var(--radius-sm)] transition-colors"
                role="menuitem"
                onClick={() => {
                  onLogout?.();
                  setOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

AccountPopover.displayName = 'AccountPopover';
