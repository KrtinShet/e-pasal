import type { CSSProperties } from 'react';

export function bgBlur(color = 'rgba(255, 255, 255, 0.8)', blur = 6): CSSProperties {
  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: color,
  };
}

export function bgGradient(direction: string, startColor: string, endColor: string): CSSProperties {
  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

export function textGradient(
  direction: string,
  startColor: string,
  endColor: string
): CSSProperties {
  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };
}

export const hideScroll: CSSProperties = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
};
