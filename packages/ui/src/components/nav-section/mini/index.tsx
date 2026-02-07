'use client';

import { memo } from 'react';

import { cn } from '../../../utils';
import type { NavGroupProps, NavSectionProps } from '../types';

import NavList from './nav-list';

function NavSectionMini({ data, slotProps, className, ...other }: NavSectionProps) {
  return (
    <nav
      id="nav-section-mini"
      className={cn('flex flex-col', `gap-[${slotProps?.gap ?? 4}px]`, className)}
      {...other}
    >
      {data.map((group, index) => (
        <Group key={group.subheader || index} items={group.items} slotProps={slotProps} />
      ))}
    </nav>
  );
}

export default memo(NavSectionMini);

function Group({ items, slotProps }: NavGroupProps) {
  return (
    <>
      {items.map((list) => (
        <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
      ))}
    </>
  );
}
