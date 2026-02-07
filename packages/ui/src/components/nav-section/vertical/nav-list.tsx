'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import type { NavListProps, NavSubListProps } from '../types';

import NavItem from './nav-item';

function useActiveLink(path: string, hasChildren: boolean) {
  const pathname = usePathname();
  if (hasChildren) {
    return pathname.startsWith(path);
  }
  return pathname === path;
}

export default function NavList({ data, depth, slotProps }: NavListProps) {
  const pathname = usePathname();
  const active = useActiveLink(data.path, !!data.children);
  const [openMenu, setOpenMenu] = useState(active);

  useEffect(() => {
    if (!active) {
      setOpenMenu(false);
    }
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
        icon={data.icon}
        info={data.info}
        roles={data.roles}
        caption={data.caption}
        disabled={data.disabled}
        depth={depth}
        hasChild={!!data.children}
        externalLink={data.path.includes('http')}
        currentRole={slotProps?.currentRole}
        active={active}
        style={{ marginBottom: slotProps?.gap ?? 4 }}
      />

      {!!data.children && openMenu && (
        <NavSubList data={data.children} depth={depth} slotProps={slotProps} />
      )}
    </>
  );
}

function NavSubList({ data, depth, slotProps }: NavSubListProps) {
  return (
    <>
      {data.map((list) => (
        <NavList key={list.title} data={list} depth={depth + 1} slotProps={slotProps} />
      ))}
    </>
  );
}
