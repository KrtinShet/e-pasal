'use client';

import Link from 'next/link';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';
import type { NavBasicItemBaseProps, NavBasicItemStateProps } from '../types';

export type NavItemProps = HTMLAttributes<HTMLDivElement> &
  NavBasicItemStateProps &
  NavBasicItemBaseProps;

const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  (
    {
      title,
      path,
      icon,
      caption,
      open,
      depth,
      active,
      hasChild,
      externalLink,
      className,
      ...other
    },
    ref
  ) => {
    const subItem = depth !== 1;

    const renderContent = (
      <div
        ref={ref}
        className={cn(
          'flex items-center cursor-pointer select-none text-sm font-medium',
          'text-[var(--color-text-secondary)] transition-colors duration-150',
          !subItem && [
            'px-4 pr-3 min-h-[44px]',
            active && 'text-[var(--color-primary)] font-semibold bg-[var(--color-primary)]/8',
            !active && open && 'bg-[var(--color-surface)]',
            !active && !open && 'hover:bg-[var(--color-surface)]',
          ],
          subItem && [
            'min-h-[32px] text-[13px]',
            `pl-${(depth as number) * 4}`,
            hasChild ? 'pr-2' : 'pr-6',
            active && 'text-[var(--color-text-primary)] bg-[var(--color-surface)] font-semibold',
            !active && open && 'text-[var(--color-text-primary)] bg-[var(--color-surface)]/50',
            !active && !open && 'hover:bg-[var(--color-surface)]',
          ],
          className
        )}
        {...other}
      >
        {icon && (
          <span
            className={cn(
              'flex shrink-0 w-5 h-5 items-center justify-center',
              !subItem ? 'mr-4' : 'ml-4'
            )}
          >
            {icon}
          </span>
        )}

        {!icon && subItem && <span className="ml-4 mr-0" />}

        <span className="inline-flex flex-col flex-1 min-w-0 ml-4">
          {title && <span className="truncate">{title}</span>}
          {caption && (
            <span className="truncate text-xs text-[var(--color-text-disabled)]">{caption}</span>
          )}
        </span>

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
            className={cn('shrink-0 ml-1.5 transition-transform duration-150', open && 'rotate-90')}
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
          className="no-underline text-inherit"
        >
          {renderContent}
        </a>
      );
    }

    return (
      <Link href={path} className="no-underline text-inherit">
        {renderContent}
      </Link>
    );
  }
);

NavItem.displayName = 'NavItemBasicMobile';

export default NavItem;
