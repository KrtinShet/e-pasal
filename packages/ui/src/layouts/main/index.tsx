'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface MainLayoutProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  isHomePage?: boolean;
}

export const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  ({ className, children, header, footer, isHomePage = false, ...props }, ref) => (
    <div ref={ref} className={cn('flex min-h-screen flex-col', className)} {...props}>
      {header}

      <main className={cn('flex-1', !isHomePage && 'pt-16 md:pt-20')}>{children}</main>

      {footer}
    </div>
  )
);

MainLayout.displayName = 'MainLayout';

export { MainHeader } from './header';
export { MainFooter } from './footer';
export type { MainHeaderProps } from './header';
export { navConfig } from './config-navigation';
export type { FooterLink, MainFooterProps, FooterLinkGroup } from './footer';
