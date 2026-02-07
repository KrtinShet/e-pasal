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
          'flex items-center gap-1 cursor-pointer select-none text-sm font-medium',
          'text-[var(--color-text-secondary)] transition-all duration-150',
          !subItem && [
            'min-h-[40px] p-0 hover:bg-transparent',
            active && 'text-[var(--color-primary)] font-semibold',
            !active && open && 'opacity-65',
          ],
          subItem && [
            'rounded-md px-2 py-1.5 text-[13px]',
            active && 'text-[var(--color-text-primary)] bg-[var(--color-surface)] font-semibold',
            !active && open && 'text-[var(--color-text-primary)] bg-[var(--color-surface)]/50',
            !active && !open && 'hover:bg-[var(--color-surface)]',
          ],
          className
        )}
        {...other}
      >
        {icon && (
          <span className="flex shrink-0 w-5 h-5 items-center justify-center mr-1">{icon}</span>
        )}

        <span className="inline-flex flex-col flex-1 min-w-0">
          {title && <span className="truncate">{title}</span>}
          {caption && !subItem
            ? null
            : caption && (
                <span className="truncate text-xs text-[var(--color-text-disabled)]">
                  {caption}
                </span>
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

NavItem.displayName = 'NavItemBasicDesktop';

export default NavItem;
