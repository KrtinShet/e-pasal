'use client';

import { useState, useEffect, useCallback } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Query = 'up' | 'down' | 'between' | 'only';

export type Value = Breakpoint | number;

function getBreakpointValue(value: Value): number {
  if (typeof value === 'number') return value;
  return BREAKPOINTS[value] ?? 0;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', handler);

    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useResponsive(query: Query, start?: Value, end?: Value): boolean {
  const buildQuery = useCallback(() => {
    const startPx = start != null ? getBreakpointValue(start) : 0;
    const endPx = end != null ? getBreakpointValue(end) : 0;

    switch (query) {
      case 'up':
        return `(min-width: ${startPx}px)`;
      case 'down':
        return `(max-width: ${startPx - 0.05}px)`;
      case 'between':
        return `(min-width: ${startPx}px) and (max-width: ${endPx - 0.05}px)`;
      case 'only': {
        const keys = Object.keys(BREAKPOINTS) as Breakpoint[];
        const idx = keys.indexOf(start as Breakpoint);
        const nextBp = keys[idx + 1];
        const max = nextBp ? BREAKPOINTS[nextBp] - 0.05 : 99999;
        return `(min-width: ${startPx}px) and (max-width: ${max}px)`;
      }
      default:
        return '';
    }
  }, [query, start, end]);

  return useMediaQuery(buildQuery());
}

export function useWidth(): Breakpoint | 'xs' {
  const keys = (Object.keys(BREAKPOINTS) as Breakpoint[]).reverse();

  const sm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);
  const md = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const lg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const xl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const xxl = useMediaQuery(`(min-width: ${BREAKPOINTS['2xl']}px)`);

  const matches: Record<Breakpoint, boolean> = { '2xl': xxl, xl, lg, md, sm };

  for (const key of keys) {
    if (matches[key]) return key;
  }

  return 'xs';
}
