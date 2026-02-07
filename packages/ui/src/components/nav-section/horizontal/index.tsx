'use client';

import { memo } from 'react';

import { cn } from '../../../utils';
import type { NavGroupProps, NavSectionProps } from '../types';

import NavList from './nav-list';

function NavSectionHorizontal({ data, slotProps, className, ...other }: NavSectionProps) {
  return (
    <nav
      id="nav-section-horizontal"
      className={cn(
        'flex flex-row items-center mx-auto',
        `gap-[${slotProps?.gap ?? 6}px]`,
        className
      )}
      {...other}
    >
      {data.map((group, index) => (
        <Group key={group.subheader || index} items={group.items} slotProps={slotProps} />
      ))}
    </nav>
  );
}

export default memo(NavSectionHorizontal);

function Group({ items, slotProps }: NavGroupProps) {
  return (
    <>
      {items.map((list) => (
        <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
      ))}
    </>
  );
}
