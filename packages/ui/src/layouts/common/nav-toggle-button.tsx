'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils';
import { NAV } from '../../styles/config-layout';

export interface NavToggleButtonProps extends HTMLAttributes<HTMLButtonElement> {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const NavToggleButton = forwardRef<HTMLButtonElement, NavToggleButtonProps>(
  ({ className, collapsed = false, onToggle, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onToggle}
      className={cn(
        'hidden lg:flex fixed z-40 items-center justify-center w-6 h-6 rounded-full',
        'border border-dashed border-[var(--color-border)]',
        'bg-[color-mix(in_srgb,var(--color-background)_48%,transparent)] backdrop-blur-sm',
        'hover:bg-[var(--color-background)] transition-colors',
        className
      )}
      style={{ top: 32, left: NAV.W_VERTICAL - 12 }}
      aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(collapsed && 'rotate-180')}
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  )
);

NavToggleButton.displayName = 'NavToggleButton';
