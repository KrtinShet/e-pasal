'use client';

import { useEffect, type ReactNode } from 'react';

import type { StoreTheme } from '@/types/store';

interface ThemeProviderProps {
  children: ReactNode;
  theme?: StoreTheme;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
      default:
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function adjustColor(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const newL = Math.max(0, Math.min(100, hsl.l + amount));
  return `hsl(${hsl.h}, ${hsl.s}%, ${newL}%)`;
}

const BORDER_RADIUS_MAP: Record<string, string> = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
};

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  useEffect(() => {
    if (!theme) return undefined;

    const root = document.documentElement;
    const cssVars: string[] = [];

    if (theme.primaryColor) {
      root.style.setProperty('--store-primary', theme.primaryColor);
      root.style.setProperty('--store-primary-light', adjustColor(theme.primaryColor, 15));
      root.style.setProperty('--store-primary-dark', adjustColor(theme.primaryColor, -15));
      cssVars.push('--store-primary', '--store-primary-light', '--store-primary-dark');
    }

    if (theme.accentColor) {
      root.style.setProperty('--store-accent', theme.accentColor);
      root.style.setProperty('--store-accent-light', adjustColor(theme.accentColor, 15));
      root.style.setProperty('--store-accent-dark', adjustColor(theme.accentColor, -15));
      cssVars.push('--store-accent', '--store-accent-light', '--store-accent-dark');
    }

    if (theme.backgroundColor) {
      root.style.setProperty('--store-background', theme.backgroundColor);
      cssVars.push('--store-background');
    }

    if (theme.textColor) {
      root.style.setProperty('--store-text', theme.textColor);
      cssVars.push('--store-text');
    }

    if (theme.borderRadius && BORDER_RADIUS_MAP[theme.borderRadius]) {
      root.style.setProperty('--store-radius', BORDER_RADIUS_MAP[theme.borderRadius]);
      cssVars.push('--store-radius');
    }

    if (theme.fontFamily) {
      root.style.setProperty('--store-font', theme.fontFamily);
      cssVars.push('--store-font');
    }

    return () => {
      cssVars.forEach((cssVar) => {
        root.style.removeProperty(cssVar);
      });
    };
  }, [theme]);

  return <>{children}</>;
}
