'use client';

import {
  useState,
  forwardRef,
  useContext,
  useCallback,
  createContext,
  type ReactNode,
  type HTMLAttributes,
} from 'react';

import { cn } from '../../utils';
import { NAV, HEADER } from '../../styles/config-layout';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export interface SidebarProviderProps {
  children: ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const toggle = useCallback(() => setCollapsed((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  header?: ReactNode;
  footer?: ReactNode;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsed: controlledCollapsed, children, header, footer, ...props }, ref) => {
    const context = useContext(SidebarContext);
    const collapsed = controlledCollapsed ?? context?.collapsed ?? false;

    return (
      <aside
        ref={ref}
        style={{ width: collapsed ? NAV.W_MINI : NAV.W_VERTICAL }}
        className={cn(
          'flex flex-col h-full shrink-0 bg-[var(--color-background)] border-r border-[var(--color-border)]',
          'transition-all duration-[var(--transition-normal)]',
          className
        )}
        data-collapsed={collapsed}
        {...props}
      >
        {header && (
          <div
            style={{ height: HEADER.H_DESKTOP }}
            className={cn(
              'flex items-center px-4 border-b border-[var(--color-border)]',
              collapsed && 'justify-center px-2'
            )}
          >
            {header}
          </div>
        )}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
        {footer && (
          <div
            className={cn(
              'border-t border-[var(--color-border)] p-4',
              collapsed && 'px-2 flex justify-center'
            )}
          >
            {footer}
          </div>
        )}
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export interface SidebarToggleProps extends HTMLAttributes<HTMLButtonElement> {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const SidebarToggle = forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, collapsed: controlledCollapsed, onToggle, ...props }, ref) => {
    const context = useContext(SidebarContext);
    const collapsed = controlledCollapsed ?? context?.collapsed ?? false;
    const handleToggle = onToggle ?? context?.toggle;

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)]',
          'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]',
          'transition-colors duration-[var(--transition-fast)]',
          className
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            'transition-transform duration-[var(--transition-fast)]',
            collapsed && 'rotate-180'
          )}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    );
  }
);

SidebarToggle.displayName = 'SidebarToggle';

export interface MobileSidebarProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  header?: ReactNode;
  footer?: ReactNode;
}

export const MobileSidebar = forwardRef<HTMLDivElement, MobileSidebarProps>(
  ({ className, open, onClose, children, header, footer, ...props }, ref) => (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        ref={ref}
        style={{ width: NAV.W_MOBILE }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-[var(--color-background)]',
          'transform transition-transform duration-[var(--transition-normal)] lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        {...props}
      >
        {header && (
          <div
            style={{ height: HEADER.H_DESKTOP }}
            className="flex items-center justify-between px-4 border-b border-[var(--color-border)]"
          >
            {header}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
              aria-label="Close sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
        {footer && <div className="border-t border-[var(--color-border)] p-4">{footer}</div>}
      </aside>
    </>
  )
);

MobileSidebar.displayName = 'MobileSidebar';
