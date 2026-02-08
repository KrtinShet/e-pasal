'use client';

import { cn } from '@baazarify/ui';
import { useState, type ReactNode } from 'react';

import { getSection } from '../schema/section-registry';

export interface EditModeWrapperProps {
  children: ReactNode;
  sectionId: string;
  sectionType: string;
  isFirst: boolean;
  isLast: boolean;
  isSelected?: boolean;
  onSelect?: (sectionId: string) => void;
  onMove?: (sectionId: string, direction: 'up' | 'down') => void;
  onDelete?: (sectionId: string) => void;
}

export function EditModeWrapper({
  children,
  sectionId,
  sectionType,
  isFirst,
  isLast,
  isSelected = false,
  onSelect,
  onMove,
  onDelete,
}: EditModeWrapperProps) {
  const [hovered, setHovered] = useState(false);
  const definition = getSection(sectionType);
  const sectionName = definition?.name || sectionType;

  return (
    <div
      className={cn(
        'group relative transition-all',
        (hovered || isSelected) && 'ring-2 ring-[var(--color-primary)] ring-offset-2'
      )}
      onClick={() => onSelect?.(sectionId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(hovered || isSelected) && (
        <div className="absolute -top-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-md bg-[var(--color-primary)] px-2 py-1 text-xs text-white shadow-md">
          <span className="font-medium">{sectionName}</span>
          <div className="mx-1 h-3 w-px bg-white/30" />
          <button
            type="button"
            className="p-0.5 hover:bg-white/20 rounded disabled:opacity-40"
            disabled={isFirst}
            onClick={() => onMove?.(sectionId, 'up')}
            title="Move up"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            type="button"
            className="p-0.5 hover:bg-white/20 rounded disabled:opacity-40"
            disabled={isLast}
            onClick={() => onMove?.(sectionId, 'down')}
            title="Move down"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            className="p-0.5 hover:bg-white/20 rounded"
            onClick={() => onSelect?.(sectionId)}
            title="Edit section"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="p-0.5 hover:bg-red-500/80 rounded"
            onClick={() => onDelete?.(sectionId)}
            title="Delete section"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
