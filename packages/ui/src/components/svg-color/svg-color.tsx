'use client';

import { forwardRef } from 'react';

import { cn } from '../../utils';

export interface SvgColorProps extends React.HTMLAttributes<HTMLSpanElement> {
  src: string;
}

export const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
  ({ src, className, style, ...other }, ref) => (
    <span
      ref={ref}
      className={cn('inline-block h-6 w-6 bg-current', className)}
      style={{
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...style,
      }}
      {...other}
    />
  )
);

SvgColor.displayName = 'SvgColor';
