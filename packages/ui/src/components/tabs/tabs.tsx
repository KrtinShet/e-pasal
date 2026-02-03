'use client';

import {
  useState,
  useContext,
  forwardRef,
  createContext,
  type ReactNode,
  type KeyboardEvent,
  type HTMLAttributes,
} from 'react';

import { cn } from '../../utils';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: 'underline' | 'pills';
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs');
  }
  return context;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'underline' | 'pills';
  children: ReactNode;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    { className, value, defaultValue = '', onChange, variant = 'underline', children, ...props },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const activeTab = isControlled ? value : internalValue;

    const setActiveTab = (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useTabs();

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

      let newIndex = currentIndex;
      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
      }

      if (newIndex !== currentIndex) {
        e.preventDefault();
        tabs[newIndex].focus();
      }
    };

    return (
      <div
        ref={ref}
        role="tablist"
        onKeyDown={handleKeyDown}
        className={cn(
          'flex',
          variant === 'underline' && 'border-b border-[var(--color-border)] gap-4',
          variant === 'pills' && 'gap-2 p-1 rounded-lg bg-[var(--color-surface)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabList.displayName = 'TabList';

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const { activeTab, setActiveTab, variant } = useTabs();
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        tabIndex={isActive ? 0 : -1}
        aria-selected={isActive}
        aria-controls={`tabpanel-${value}`}
        disabled={disabled}
        onClick={() => setActiveTab(value)}
        className={cn(
          'relative px-4 py-2 text-sm font-medium transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50',
          disabled && 'opacity-50 cursor-not-allowed',
          variant === 'underline' && [
            'pb-3 -mb-px',
            isActive
              ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
          ],
          variant === 'pills' && [
            'rounded-md',
            isActive
              ? 'bg-[var(--color-background)] text-[var(--color-text)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Tab.displayName = 'Tab';

export interface TabPanelsProps extends HTMLAttributes<HTMLDivElement> {}

export const TabPanels = forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('mt-4', className)} {...props} />
);

TabPanels.displayName = 'TabPanels';

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab } = useTabs();
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${value}`}
        tabIndex={0}
        className={cn('focus:outline-none animate-in fade-in-0', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabPanel.displayName = 'TabPanel';
