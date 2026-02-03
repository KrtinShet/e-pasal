'use client';

import {
  useState,
  forwardRef,
  useCallback,
  type ReactNode,
  type ForwardedRef,
  type HTMLAttributes,
} from 'react';

import { cn } from '../../utils';

import { DashboardHeader } from './header';
import { Sidebar, useSidebar, MobileSidebar, SidebarToggle, SidebarProvider } from './sidebar';

export interface DashboardLayoutProps extends HTMLAttributes<HTMLDivElement> {
  sidebarHeader?: ReactNode;
  sidebarContent: ReactNode;
  sidebarFooter?: ReactNode;
  headerLeftContent?: ReactNode;
  headerRightContent?: ReactNode;
  defaultSidebarCollapsed?: boolean;
}

interface DashboardLayoutInnerProps extends Omit<DashboardLayoutProps, 'defaultSidebarCollapsed'> {
  innerRef?: ForwardedRef<HTMLDivElement>;
}

function DashboardLayoutInner({
  className,
  children,
  sidebarHeader,
  sidebarContent,
  sidebarFooter,
  headerLeftContent,
  headerRightContent,
  innerRef,
  ...props
}: DashboardLayoutInnerProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useSidebar();

  const openMobileSidebar = useCallback(() => setMobileOpen(true), []);
  const closeMobileSidebar = useCallback(() => setMobileOpen(false), []);

  return (
    <div
      ref={innerRef}
      className={cn('flex h-screen bg-[var(--color-surface)]', className)}
      {...props}
    >
      <div className="hidden lg:block">
        <Sidebar header={sidebarHeader} footer={sidebarFooter}>
          {sidebarContent}
        </Sidebar>
      </div>

      <MobileSidebar
        open={mobileOpen}
        onClose={closeMobileSidebar}
        header={sidebarHeader}
        footer={sidebarFooter}
      >
        {sidebarContent}
      </MobileSidebar>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          onMenuClick={openMobileSidebar}
          leftContent={
            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                <SidebarToggle />
              </div>
              {headerLeftContent}
            </div>
          }
          rightContent={headerRightContent}
        />

        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 lg:p-6',
            'transition-all duration-[var(--transition-normal)]'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export const DashboardLayout = forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ defaultSidebarCollapsed = false, ...props }, ref) => (
    <SidebarProvider defaultCollapsed={defaultSidebarCollapsed}>
      <DashboardLayoutInner innerRef={ref} {...props} />
    </SidebarProvider>
  )
);

DashboardLayout.displayName = 'DashboardLayout';

export interface ContentSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: ReactNode;
  noPadding?: boolean;
}

export const ContentSection = forwardRef<HTMLDivElement, ContentSectionProps>(
  ({ className, title, description, action, noPadding = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-[var(--color-background)] rounded-[var(--radius-lg)] border border-[var(--color-border)]',
        className
      )}
      {...props}
    >
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4 p-4 lg:p-6 border-b border-[var(--color-border)]">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={cn(!noPadding && 'p-4 lg:p-6')}>{children}</div>
    </div>
  )
);

ContentSection.displayName = 'ContentSection';

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumbs?: ReactNode;
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, action, breadcrumbs, ...props }, ref) => (
    <div ref={ref} className={cn('mb-6 lg:mb-8', className)} {...props}>
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
          )}
        </div>
        {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
);

PageHeader.displayName = 'PageHeader';
