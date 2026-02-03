'use client';

import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from 'react';

import { cn } from '../../utils';

export interface DashboardHeaderProps extends HTMLAttributes<HTMLElement> {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const DashboardHeader = forwardRef<HTMLElement, DashboardHeaderProps>(
  ({ className, leftContent, rightContent, onMenuClick, showMenuButton = true, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6',
        'bg-[var(--color-background)] border-b border-[var(--color-border)]',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            className={cn(
              'lg:hidden flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)]',
              'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]',
              'transition-colors duration-[var(--transition-fast)]'
            )}
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
        )}
        {leftContent}
      </div>
      <div className="flex items-center gap-2">{rightContent}</div>
    </header>
  )
);

DashboardHeader.displayName = 'DashboardHeader';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  as?: React.ElementType;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, items, separator, as: LinkComponent = 'a', ...props }, ref) => {
    const defaultSeparator = (
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
        className="text-[var(--color-text-muted)]"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    );

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('flex items-center', className)}
        {...props}
      >
        <ol className="flex items-center gap-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-1">
                {item.href && !isLast ? (
                  <LinkComponent
                    href={item.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {item.label}
                  </LinkComponent>
                ) : (
                  <span
                    className={cn(
                      'text-sm',
                      isLast
                        ? 'text-[var(--color-text-primary)] font-medium'
                        : 'text-[var(--color-text-secondary)]'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
                {!isLast && <span aria-hidden="true">{separator || defaultSeparator}</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';

export interface UserMenuProps extends HTMLAttributes<HTMLDivElement> {
  user: {
    name: string;
    email?: string;
    avatar?: string;
  };
  menuItems?: Array<{
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    href?: string;
    divider?: boolean;
    variant?: 'default' | 'danger';
  }>;
  as?: React.ElementType;
}

export const UserMenu = forwardRef<HTMLDivElement, UserMenuProps>(
  ({ className, user, menuItems = [], as: LinkComponent = 'a', ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initials = user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div ref={menuRef} className={cn('relative', className)} {...props}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-2 p-1.5 rounded-[var(--radius-md)]',
            'hover:bg-[var(--color-surface)] transition-colors duration-[var(--transition-fast)]'
          )}
          aria-expanded={open}
          aria-haspopup="true"
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium">
              {initials}
            </div>
          )}
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
            className={cn(
              'text-[var(--color-text-muted)] transition-transform duration-[var(--transition-fast)]',
              open && 'rotate-180'
            )}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div
            className={cn(
              'absolute right-0 top-full mt-1 w-56 py-1',
              'bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-lg)]',
              'shadow-[var(--shadow-lg)] z-50'
            )}
            role="menu"
          >
            <div className="px-4 py-3 border-b border-[var(--color-border)]">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{user.name}</p>
              {user.email && (
                <p className="text-xs text-[var(--color-text-muted)] truncate">{user.email}</p>
              )}
            </div>
            {menuItems.map((item, index) =>
              item.divider ? (
                <div key={index} className="my-1 border-t border-[var(--color-border)]" />
              ) : item.href ? (
                <LinkComponent
                  key={index}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                    item.variant === 'danger'
                      ? 'text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
                  )}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  {item.label}
                </LinkComponent>
              ) : (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-2 w-full px-4 py-2 text-sm text-left transition-colors',
                    item.variant === 'danger'
                      ? 'text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
                  )}
                  role="menuitem"
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  {item.label}
                </button>
              )
            )}
          </div>
        )}
      </div>
    );
  }
);

UserMenu.displayName = 'UserMenu';

export interface NotificationBellProps extends HTMLAttributes<HTMLButtonElement> {
  count?: number;
  onClick?: () => void;
}

export const NotificationBell = forwardRef<HTMLButtonElement, NotificationBellProps>(
  ({ className, count, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)]',
        'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]',
        'transition-colors duration-[var(--transition-fast)]',
        className
      )}
      aria-label={count ? `${count} notifications` : 'Notifications'}
      {...props}
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
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1',
            'text-xs font-semibold text-white bg-[var(--color-error)] rounded-full'
          )}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
);

NotificationBell.displayName = 'NotificationBell';

export interface SearchBarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onSubmit'
> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export const SearchBar = forwardRef<HTMLDivElement, SearchBarProps>(
  ({ className, placeholder = 'Search...', value, onChange, onSubmit, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(value || '');
    const inputValue = value !== undefined ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(inputValue);
    };

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={inputValue}
              onChange={handleChange}
              placeholder={placeholder}
              className={cn(
                'w-full h-10 pl-10 pr-4 rounded-[var(--radius-md)]',
                'bg-[var(--color-surface)] border border-[var(--color-border)]',
                'text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
                'transition-shadow duration-[var(--transition-fast)]'
              )}
            />
          </div>
        </form>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
