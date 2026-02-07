'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';
import { HEADER } from '../../styles/config-layout';
import { useOffSetTop } from '../../hooks/use-off-set-top';

import { HeaderShadow } from './header-shadow';

export interface HeaderSimpleProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  action?: ReactNode;
}

export const HeaderSimple = forwardRef<HTMLElement, HeaderSimpleProps>(
  ({ className, logo, action, ...props }, ref) => {
    const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

    return (
      <header ref={ref} className={cn('sticky top-0 z-30', className)} {...props}>
        <div
          style={{
            height: HEADER.H_DESKTOP,
          }}
          className={cn(
            'flex items-center justify-between px-4 md:px-6 transition-all duration-200',
            offsetTop
              ? 'bg-[color-mix(in_srgb,var(--color-background)_80%,transparent)] backdrop-blur-xl'
              : 'bg-transparent'
          )}
        >
          {logo}
          <div className="flex items-center gap-2">{action}</div>
        </div>

        {offsetTop && <HeaderShadow />}
      </header>
    );
  }
);

HeaderSimple.displayName = 'HeaderSimple';
