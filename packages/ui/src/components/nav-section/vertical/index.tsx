'use client';

import { memo, useState, useCallback } from 'react';

import { cn } from '../../../utils';
import type { NavGroupProps, NavSectionProps } from '../types';

import NavList from './nav-list';

function NavSectionVertical({ data, slotProps, className, ...other }: NavSectionProps) {
  return (
    <nav id="nav-section-vertical" className={cn('flex flex-col', className)} {...other}>
      {data.map((group, index) => (
        <Group
          key={group.subheader || index}
          subheader={group.subheader}
          items={group.items}
          slotProps={slotProps}
        />
      ))}
    </nav>
  );
}

export default memo(NavSectionVertical);

function Group({ subheader, items, slotProps }: NavGroupProps) {
  const [open, setOpen] = useState(true);
  const handleToggle = useCallback(() => setOpen((prev) => !prev), []);

  const renderContent = items.map((list) => (
    <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
  ));

  return (
    <div className="px-2">
      {subheader ? (
        <>
          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              'inline-flex w-full text-[11px] uppercase tracking-wider font-semibold',
              'text-[var(--color-text-disabled)] cursor-pointer px-1.5 pt-2 pb-1',
              'transition-colors duration-150 hover:text-[var(--color-text-primary)]',
              `mb-[${slotProps?.gap ?? 4}px]`
            )}
          >
            {subheader}
          </button>
          {open && renderContent}
        </>
      ) : (
        renderContent
      )}
    </div>
  );
}
