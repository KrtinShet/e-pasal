'use client';

import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect, useCallback } from 'react';

import { cn } from '../../../utils';
import type { NavBasicListProps, NavBasicSubListProps } from '../types';

import NavItem from './nav-item';

function useActiveLink(path: string, hasChildren: boolean) {
  const pathname = usePathname();
  return hasChildren ? pathname.startsWith(path) : pathname === path;
}

export default function NavList({ data, depth, slotProps }: NavBasicListProps) {
  const navRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const active = useActiveLink(data.path, !!data.children);
  const [openMenu, setOpenMenu] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (openMenu) setOpenMenu(false);
  }, [pathname, openMenu]);

  const updatePosition = useCallback(() => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    if (depth === 1) {
      setPosition({ top: rect.bottom, left: rect.left });
    } else {
      setPosition({ top: rect.top, left: rect.right + 2 });
    }
  }, [depth]);

  const handleOpenMenu = useCallback(() => {
    if (data.children) {
      updatePosition();
      setOpenMenu(true);
    }
  }, [data.children, updatePosition]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  return (
    <>
      <NavItem
        ref={navRef}
        open={openMenu}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={handleCloseMenu}
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

      {!!data.children &&
        openMenu &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{ top: position.top, left: position.left }}
            className={cn(
              'fixed z-50 min-w-[160px] py-1 rounded-lg shadow-lg',
              'bg-[var(--color-background)] border border-[var(--color-border)]'
            )}
            onMouseEnter={handleOpenMenu}
            onMouseLeave={handleCloseMenu}
          >
            <NavSubList data={data.children} depth={depth} slotProps={slotProps} />
          </div>,
          document.body
        )}
    </>
  );
}

function NavSubList({ data, depth, slotProps }: NavBasicSubListProps) {
  return (
    <div className="flex flex-col gap-0.5 p-1">
      {data.map((list) => (
        <NavList key={list.title} data={list} depth={depth + 1} slotProps={slotProps} />
      ))}
    </div>
  );
}
