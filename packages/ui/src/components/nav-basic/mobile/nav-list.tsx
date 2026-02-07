'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import type { NavBasicListProps, NavBasicSubListProps } from '../types';

import NavItem from './nav-item';

function useActiveLink(path: string, hasChildren: boolean) {
  const pathname = usePathname();
  return hasChildren ? pathname.startsWith(path) : pathname === path;
}

export default function NavList({ data, depth, slotProps }: NavBasicListProps) {
  const pathname = usePathname();
  const active = useActiveLink(data.path, !!data.children);
  const [openMenu, setOpenMenu] = useState(active);

  useEffect(() => {
    if (!active) setOpenMenu(false);
  }, [pathname, active]);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu((prev: boolean) => !prev);
    }
  }, [data.children]);

  return (
    <>
      <NavItem
        open={openMenu}
        onClick={handleToggleMenu}
        title={data.title}
        path={data.path}
        caption={data.caption}
        icon={data.icon}
        depth={depth}
        hasChild={!!data.children}
        externalLink={!!data.path.includes('http')}
        active={active}
        className={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      />

      {!!data.children && openMenu && (
        <NavSubList data={data.children} depth={depth} slotProps={slotProps} />
      )}
    </>
  );
}

function NavSubList({ data, depth, slotProps }: NavBasicSubListProps) {
  return (
    <>
      {data.map((list) => (
        <NavList key={list.title} data={list} depth={depth + 1} slotProps={slotProps} />
      ))}
    </>
  );
}
