'use client';

import Link from 'next/link';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';
import type { NavItemBaseProps, NavItemStateProps } from '../types';

export type NavItemProps = HTMLAttributes<HTMLDivElement> & NavItemStateProps & NavItemBaseProps;

const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  (
    {
      title,
      path,
      icon,
      info,
      disabled,
      caption,
      roles,
      open,
      depth,
      active,
      hasChild,
      externalLink,
      currentRole = 'admin',
      className,
      ...other
    },
    ref
  ) => {
    const subItem = depth !== 1;

    if (roles && !roles.includes(currentRole)) {
      return null;
    }

    const renderContent = (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-1 rounded-md cursor-pointer select-none whitespace-nowrap',
          'text-[var(--color-text-secondary)] text-sm font-medium transition-colors duration-150',
          !subItem && 'min-h-[32px] px-1.5 shrink-0',
          subItem && 'min-h-[34px] px-2',
          active && 'text-[var(--color-text-primary)] bg-[var(--color-surface)] font-semibold',
          !active && open && 'text-[var(--color-text-primary)] bg-[var(--color-surface)]/50',
          !active && !open && 'hover:bg-[var(--color-surface)]',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        {...other}
      >
        {icon && (
          <span className="flex shrink-0 w-[22px] h-[22px] items-center justify-center mr-1">
            {icon}
          </span>
        )}

        {title && <span className="capitalize">{title}</span>}

        {caption && (
          <span className="ml-1.5 text-[var(--color-text-disabled)]" title={caption}>
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
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </span>
        )}

        {info && <span className="inline-flex ml-1.5">{info}</span>}

        {hasChild && (
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
            className="shrink-0 ml-1.5"
          >
            {subItem ? <path d="M9 18l6-6-6-6" /> : <path d="M6 9l6 6 6-6" />}
          </svg>
        )}
      </div>
    );

    if (hasChild) {
      return renderContent;
    }

    if (externalLink) {
      return (
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(disabled && 'cursor-default')}
        >
          {renderContent}
        </a>
      );
    }

    return (
      <Link href={path} className={cn(disabled && 'cursor-default')}>
        {renderContent}
      </Link>
    );
  }
);

NavItem.displayName = 'NavItemHorizontal';

export default NavItem;
