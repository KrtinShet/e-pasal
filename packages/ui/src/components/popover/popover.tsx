'use client';

import { createPortal } from 'react-dom';
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react';

import { cn } from '../../utils';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'click' | 'hover';

export interface PopoverProps {
  content: ReactNode;
  children: ReactNode;
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  offset?: number;
  className?: string;
  showArrow?: boolean;
}

export function Popover({
  content,
  children,
  placement = 'bottom',
  trigger = 'click',
  open: controlledOpen,
  onOpenChange,
  offset = 8,
  className,
  showArrow = true,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
    },
    [isControlled, onOpenChange]
  );

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top + scrollY - contentRect.height - offset;
        left = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + offset;
        left = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.left + scrollX - contentRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.right + scrollX + offset;
        break;
      default:
        top = triggerRect.bottom + scrollY + offset;
        left = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2;
    }

    left = Math.max(8, Math.min(left, window.innerWidth - contentRect.width - 8));
    top = Math.max(8, top);

    setPosition({ top, left });
  }, [placement, offset]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || trigger !== 'click') return undefined;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        contentRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, trigger, setOpen]);

  const triggerProps =
    trigger === 'click'
      ? { onClick: () => setOpen(!isOpen) }
      : {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
        };

  const contentHoverProps =
    trigger === 'hover'
      ? {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
        }
      : {};

  const arrowStyles: Record<PopoverPlacement, string> = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
  };

  return (
    <>
      <div ref={triggerRef} className="inline-block" {...triggerProps}>
        {children}
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={contentRef}
            style={position}
            className={cn(
              'fixed z-50 min-w-[8rem] rounded-lg shadow-lg',
              'bg-[var(--color-background)] border border-[var(--color-border)]',
              'animate-in fade-in-0 zoom-in-95',
              className
            )}
            {...contentHoverProps}
          >
            {showArrow && (
              <div
                className={cn(
                  'absolute w-2 h-2 bg-[var(--color-background)] border border-[var(--color-border)]',
                  arrowStyles[placement]
                )}
              />
            )}
            <div className="relative">{content}</div>
          </div>,
          document.body
        )}
    </>
  );
}
