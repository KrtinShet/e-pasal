'use client';

import { memo } from 'react';

import { cn } from '../../../utils';
import type { NavBasicProps } from '../types';

import NavList from './nav-list';

function NavBasicMobile({ data, slotProps, className, ...other }: NavBasicProps) {
  return (
    <nav id="nav-basic-mobile" className={cn('flex flex-col', className)} {...other}>
      {data.map((list) => (
        <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
      ))}
    </nav>
  );
}

export default memo(NavBasicMobile);
