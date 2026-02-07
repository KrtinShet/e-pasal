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
          'relative flex cursor-pointer select-none transition-colors duration-150',
          'text-[var(--color-text-secondary)]',
          !subItem && [
            'flex-col items-center justify-center text-center',
            'min-h-[56px] rounded-lg mx-1 p-1 text-[10px] leading-4 font-semibold',
            active && 'bg-[var(--color-primary)]/8 text-[var(--color-primary)] font-bold',
            !active && open && 'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
            !active && !open && 'hover:bg-[var(--color-surface)]',
          ],
          subItem && [
            'items-center gap-1 min-h-[34px] px-2 rounded-md text-sm font-medium',
            active && 'text-[var(--color-text-primary)] bg-[var(--color-surface)] font-semibold',
            !active && open && 'text-[var(--color-text-primary)] bg-[var(--color-surface)]/50',
            !active && !open && 'hover:bg-[var(--color-surface)]',
          ],
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        {...other}
      >
        {icon && (
          <span className="flex shrink-0 w-[22px] h-[22px] items-center justify-center">
            {icon}
          </span>
        )}

        {title && (
          <span
            className={cn('truncate w-full', !subItem && 'mt-1', subItem && 'capitalize flex-1')}
          >
            {title}
          </span>
        )}

        {caption && !subItem && (
          <span
            className="absolute top-[11px] left-1.5 text-[var(--color-text-disabled)]"
            title={caption}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </span>
        )}

        {info && subItem && <span className="inline-flex ml-1.5">{info}</span>}

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
            className={cn(
              'shrink-0',
              !subItem && 'absolute top-[11px] right-1.5',
              subItem && 'ml-1.5'
            )}
          >
            <path d="M9 18l6-6-6-6" />
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
          className={cn('w-full', disabled && 'cursor-default')}
        >
          {renderContent}
        </a>
      );
    }

    return (
      <Link href={path} className={cn('w-full', disabled && 'cursor-default')}>
        {renderContent}
      </Link>
    );
  }
);

NavItem.displayName = 'NavItemMini';

export default NavItem;
