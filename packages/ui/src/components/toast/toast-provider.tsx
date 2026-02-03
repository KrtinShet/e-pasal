'use client';

import { createPortal } from 'react-dom';
import { useState, useContext, useCallback, createContext, type ReactNode } from 'react';

import { cn } from '../../utils';

import { Toast, type ToastVariant } from './toast';

export interface ToastData {
  id: string;
  variant?: ToastVariant;
  title?: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastData[];
  addToast: (data: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export interface ToastProviderProps {
  children: ReactNode;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  maxToasts?: number;
}

const positionClasses: Record<NonNullable<ToastProviderProps['position']>, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (data: Omit<ToastData, 'id'>) => {
      const id = Math.random().toString(36).slice(2, 9);
      const duration = data.duration ?? 5000;

      setToasts((prev) => {
        const newToasts = [...prev, { ...data, id }];
        return newToasts.slice(-maxToasts);
      });

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    [maxToasts]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            className={cn(
              'fixed z-[100] flex flex-col gap-2 pointer-events-none',
              positionClasses[position]
            )}
          >
            {toasts.map((t) => (
              <div key={t.id} className="pointer-events-auto">
                <Toast
                  variant={t.variant}
                  title={t.title}
                  description={t.description}
                  onClose={() => removeToast(t.id)}
                />
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function showToast(options: Omit<ToastData, 'id'>) {
  console.warn('showToast() must be used within a ToastProvider. Use useToast() hook instead.');
  return '';
}

showToast.success = (title: string, description?: string) =>
  showToast({ variant: 'success', title, description });

showToast.error = (title: string, description?: string) =>
  showToast({ variant: 'error', title, description });

showToast.warning = (title: string, description?: string) =>
  showToast({ variant: 'warning', title, description });

showToast.info = (title: string, description?: string) =>
  showToast({ variant: 'info', title, description });

export { showToast as toast };
