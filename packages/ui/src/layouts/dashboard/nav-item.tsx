'use client';

import { forwardRef, type ReactNode, type AnchorHTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactNode;
  label: string;
  active?: boolean;
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  collapsed?: boolean;
  disabled?: boolean;
  as?: React.ElementType;
}

const badgeVariants = {
  default: 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]',
  primary: 'bg-[var(--color-primary)] text-white',
  success: 'bg-[var(--color-success)] text-white',
  warning: 'bg-[var(--color-warning)] text-white',
  error: 'bg-[var(--color-error)] text-white',
} as const;

export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(
  (
    {
      className,
      icon,
      label,
      active = false,
      badge,
      badgeVariant = 'default',
      collapsed = false,
      disabled = false,
      as: Component = 'a',
      ...props
    },
    ref
  ) => (
    <Component
      ref={ref}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-all duration-[var(--transition-fast)]',
        'text-sm font-medium',
        active
          ? 'bg-[var(--color-primary)] text-white'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]',
        disabled && 'opacity-50 pointer-events-none',
        collapsed && 'justify-center px-2',
        className
      )}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {icon && (
        <span
          className={cn(
            'flex-shrink-0 w-5 h-5',
            active
              ? 'text-white'
              : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'
          )}
        >
          {icon}
        </span>
      )}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge !== undefined && (
            <span
              className={cn(
                'flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full',
                badgeVariants[badgeVariant]
              )}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </Component>
  )
);

NavItem.displayName = 'NavItem';

export interface NavGroupProps {
  label?: string;
  children: ReactNode;
  collapsed?: boolean;
  className?: string;
}

export function NavGroup({ label, children, collapsed = false, className }: NavGroupProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && !collapsed && (
        <span className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </span>
      )}
      {collapsed && label && <div className="border-t border-[var(--color-border)] my-2" />}
      <nav className="space-y-0.5">{children}</nav>
    </div>
  );
}
