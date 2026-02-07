'use client';

import { forwardRef } from 'react';

import { cn } from '../../utils';

import type { TextMaxLineProps } from './types';

const lineClampClass: Record<number, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

export const TextMaxLine = forwardRef<HTMLElement, TextMaxLineProps>(
  ({ asLink, line = 2, persistent = false, children, className, href, ...other }, ref) => {
    const clampClass = lineClampClass[line] || `line-clamp-[${line}]`;

    if (asLink) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn('text-inherit no-underline', clampClass, className)}
          {...other}
        >
          {children}
        </a>
      );
    }

    return (
      <p
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={cn(clampClass, className)}
        {...other}
      >
        {children}
      </p>
    );
  }
);

TextMaxLine.displayName = 'TextMaxLine';
