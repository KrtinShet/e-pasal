'use client';

import { createPortal } from 'react-dom';
import {
  useRef,
  useEffect,
  forwardRef,
  type ReactNode,
  type KeyboardEvent,
  type HTMLAttributes,
} from 'react';

import { cn } from '../../utils';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const modalSizes: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[95vw] max-h-[95vh]',
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEscape) return undefined;

    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEscape, onClose]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="presentation">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative z-50 w-full bg-[var(--color-background)] rounded-lg shadow-xl',
          'flex flex-col max-h-[90vh]',
          'animate-in fade-in-0 zoom-in-95',
          modalSizes[size],
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, onClose, showCloseButton = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]',
        className
      )}
      {...props}
    >
      <div className="text-lg font-semibold text-[var(--color-text)]">{children}</div>
      {showCloseButton && onClose && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'p-1 rounded-md transition-colors',
            'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
            'hover:bg-[var(--color-surface)]'
          )}
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
);

ModalHeader.displayName = 'ModalHeader';

export const ModalBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-auto px-6 py-4', className)} {...props} />
  )
);

ModalBody.displayName = 'ModalBody';

export const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]',
        className
      )}
      {...props}
    />
  )
);

ModalFooter.displayName = 'ModalFooter';
