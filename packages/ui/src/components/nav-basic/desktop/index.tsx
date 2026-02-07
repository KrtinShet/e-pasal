'use client';

import { memo } from 'react';

import { cn } from '../../../utils';
import type { NavBasicProps } from '../types';

import NavList from './nav-list';

function NavBasicDesktop({ data, slotProps, className, ...other }: NavBasicProps) {
  return (
    <nav
      id="nav-basic-desktop"
      className={cn('flex flex-row items-center gap-5', className)}
      {...other}
    >
      {data.map((list) => (
        <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
      ))}
    </nav>
  );
}

export default memo(NavBasicDesktop);
