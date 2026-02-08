'use client';

import { forwardRef, type ReactNode, type AnchorHTMLAttributes } from 'react';

import { cn } from '../../utils';

import { useOptionalSidebar } from './sidebar';

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
      collapsed,
      disabled = false,
      as: Component = 'a',
      ...props
    },
    ref
  ) => {
    const sidebar = useOptionalSidebar();
    const isCollapsed = collapsed ?? sidebar?.collapsed ?? false;

    return (
      <Component
        ref={ref}
        className={cn(
          'group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-all duration-[var(--transition-fast)]',
          active
            ? 'bg-[var(--color-primary)] text-white'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]',
          disabled && 'pointer-events-none opacity-50',
          isCollapsed && 'justify-center px-2',
          className
        )}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled}
        title={isCollapsed ? label : undefined}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              'h-5 w-5 flex-shrink-0 transition-colors',
              active
                ? 'text-white'
                : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'
            )}
          >
            {icon}
          </span>
        )}
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{label}</span>
            {badge !== undefined && (
              <span
                className={cn(
                  'flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                  badgeVariants[badgeVariant]
                )}
              >
                {badge}
              </span>
            )}
          </>
        )}
      </Component>
    );
  }
);

NavItem.displayName = 'NavItem';

export interface NavGroupProps {
  label?: string;
  children: ReactNode;
  collapsed?: boolean;
  className?: string;
}

export function NavGroup({ label, children, collapsed, className }: NavGroupProps) {
  const sidebar = useOptionalSidebar();
  const isCollapsed = collapsed ?? sidebar?.collapsed ?? false;

  return (
    <div className={cn('space-y-1', className)}>
      {label && !isCollapsed && (
        <span className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </span>
      )}
      {isCollapsed && label && <div className="my-2 border-t border-[var(--color-border)]" />}
      <nav className="space-y-0.5">{children}</nav>
    </div>
  );
}
