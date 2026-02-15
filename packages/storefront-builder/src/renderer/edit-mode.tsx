'use client';

import { cn } from '@baazarify/ui';
import { ChevronUp, ChevronDown, Trash2, GripVertical } from 'lucide-react';
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
          <GripVertical className="h-3.5 w-3.5" />
          <span className="font-medium">{sectionName}</span>
          <div className="mx-1 h-3 w-px bg-white/30" />
          <button
            type="button"
            className="p-0.5 hover:bg-white/20 rounded disabled:opacity-40"
            disabled={isFirst}
            onClick={() => onMove?.(sectionId, 'up')}
            title="Move up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-0.5 hover:bg-white/20 rounded disabled:opacity-40"
            disabled={isLast}
            onClick={() => onMove?.(sectionId, 'down')}
            title="Move down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-0.5 hover:bg-red-500/80 rounded"
            onClick={() => onDelete?.(sectionId)}
            title="Delete section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
