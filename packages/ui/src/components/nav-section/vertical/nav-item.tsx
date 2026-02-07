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
          'flex items-center gap-2 rounded-lg px-3 cursor-pointer select-none',
          'text-[var(--color-text-secondary)] transition-colors duration-150',
          !subItem && 'min-h-[44px] py-1',
          subItem && 'min-h-[36px] py-0.5',
          subItem && depth && depth > 2 && `pl-${(depth as number) * 4}`,
          active &&
            !subItem &&
            'bg-[var(--color-primary)]/8 text-[var(--color-primary)] font-semibold',
          active && subItem && 'text-[var(--color-text-primary)]',
          !active && 'hover:bg-[var(--color-surface)]',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        {...other}
      >
        {!subItem && icon && (
          <span className="flex shrink-0 w-6 h-6 items-center justify-center">{icon}</span>
        )}

        {subItem &&
          (icon ? (
            <span className="flex shrink-0 w-6 h-6 items-center justify-center">{icon}</span>
          ) : (
            <span className="flex shrink-0 w-6 h-6 items-center justify-center">
              <span
                className={cn(
                  'w-1 h-1 rounded-full bg-[var(--color-text-disabled)] transition-transform duration-150',
                  active && 'scale-200 bg-[var(--color-primary)]'
                )}
              />
            </span>
          ))}

        {title && (
          <span className="flex-1 min-w-0">
            <span className="block truncate capitalize text-sm">{title}</span>
            {caption && (
              <span
                className="block truncate text-xs text-[var(--color-text-disabled)]"
                title={caption}
              >
                {caption}
              </span>
            )}
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

NavItem.displayName = 'NavItem';

export default NavItem;
