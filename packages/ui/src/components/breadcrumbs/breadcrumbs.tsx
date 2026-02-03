'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  separator?: ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      className,
      children,
      separator = '/',
      maxItems,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 2,
      ...props
    },
    ref
  ) => {
    const items = Array.isArray(children) ? children : [children];
    const shouldCollapse = maxItems && items.length > maxItems;

    const renderItems = () => {
      if (!shouldCollapse) {
        return items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-[var(--color-text-muted)]" aria-hidden="true">
                {separator}
              </span>
            )}
            {item}
          </li>
        ));
      }

      const beforeItems = items.slice(0, itemsBeforeCollapse);
      const afterItems = items.slice(-itemsAfterCollapse);

      return [
        ...beforeItems.map((item, index) => (
          <li key={`before-${index}`} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-[var(--color-text-muted)]" aria-hidden="true">
                {separator}
              </span>
            )}
            {item}
          </li>
        )),
        <li key="ellipsis" className="flex items-center">
          <span className="mx-2 text-[var(--color-text-muted)]" aria-hidden="true">
            {separator}
          </span>
          <span className="text-[var(--color-text-muted)]">...</span>
        </li>,
        ...afterItems.map((item, index) => (
          <li key={`after-${index}`} className="flex items-center">
            <span className="mx-2 text-[var(--color-text-muted)]" aria-hidden="true">
              {separator}
            </span>
            {item}
          </li>
        )),
      ];
    };

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
        <ol className="flex flex-wrap items-center">{renderItems()}</ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLSpanElement> {
  href?: string;
  isCurrentPage?: boolean;
}

export const BreadcrumbItem = forwardRef<HTMLSpanElement, BreadcrumbItemProps>(
  ({ className, href, isCurrentPage, children, ...props }, ref) => {
    const baseClasses = cn(
      'text-sm transition-colors',
      isCurrentPage
        ? 'text-[var(--color-text)] font-medium'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
      className
    );

    if (href && !isCurrentPage) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={baseClasses}
          {...(props as HTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <span
        ref={ref}
        aria-current={isCurrentPage ? 'page' : undefined}
        className={baseClasses}
        {...props}
      >
        {children}
      </span>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export const BreadcrumbSeparator = {
  Slash: () => <span>/</span>,
  Chevron: ChevronIcon,
  Arrow: () => <span>→</span>,
};
