'use client';

import { createPortal } from 'react-dom';
import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useContext,
  useCallback,
  createContext,
  type ReactNode,
  type KeyboardEvent,
  type HTMLAttributes,
} from 'react';

import { cn } from '../../utils';

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown');
  }
  return context;
}

export interface DropdownProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dropdown({ children, open: controlledOpen, onOpenChange }: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
      if (!value) {
        setActiveIndex(-1);
      }
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <DropdownContext.Provider
      value={{ isOpen, setIsOpen, activeIndex, setActiveIndex, triggerRef, menuRef }}
    >
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ className, children, onClick, onKeyDown, ...props }, ref) => {
    const { isOpen, setIsOpen, triggerRef, setActiveIndex } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setIsOpen(!isOpen);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(0);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    return (
      <button
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownTrigger.displayName = 'DropdownTrigger';

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, children, align = 'start', ...props }, ref) => {
    const { isOpen, setIsOpen, menuRef, triggerRef, activeIndex, setActiveIndex } = useDropdown();
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        let left = rect.left + scrollX;
        if (align === 'end') {
          left = rect.right + scrollX - (menuRef.current?.offsetWidth || 0);
        } else if (align === 'center') {
          left = rect.left + scrollX + (rect.width - (menuRef.current?.offsetWidth || 0)) / 2;
        }

        setPosition({
          top: rect.bottom + scrollY + 4,
          left,
        });
      }
    }, [isOpen, align, triggerRef, menuRef]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const items = menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([disabled])'
      );
      if (!items?.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((activeIndex + 1) % items.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((activeIndex - 1 + items.length) % items.length);
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(items.length - 1);
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case 'Tab':
          setIsOpen(false);
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      if (activeIndex >= 0 && menuRef.current) {
        const items = menuRef.current.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([disabled])'
        );
        items[activeIndex]?.focus();
      }
    }, [activeIndex, menuRef]);

    if (!isOpen) return null;

    return createPortal(
      <div
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="menu"
        aria-orientation="vertical"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={{ position: 'fixed', top: position.top, left: position.left }}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-lg',
          'bg-[var(--color-background)] border border-[var(--color-border)] shadow-lg',
          'py-1 animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
      </div>,
      document.body
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';

export interface DropdownItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  destructive?: boolean;
  icon?: ReactNode;
  onSelect?: () => void;
}

export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    { className, children, disabled, destructive, icon, onSelect, onClick, onKeyDown, ...props },
    ref
  ) => {
    const { setIsOpen } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(e);
      onSelect?.();
      setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        onSelect?.();
        setIsOpen(false);
      }
    };

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer outline-none transition-colors',
          'focus:bg-[var(--color-surface)]',
          destructive
            ? 'text-[var(--color-error)] hover:bg-[var(--color-error)]/10'
            : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
        {children}
      </div>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';

export function DropdownDivider({ className }: { className?: string }) {
  return <div className={cn('h-px my-1 bg-[var(--color-border)]', className)} role="separator" />;
}

export interface DropdownLabelProps extends HTMLAttributes<HTMLDivElement> {}

export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)]', className)}
      {...props}
    />
  )
);

DropdownLabel.displayName = 'DropdownLabel';
