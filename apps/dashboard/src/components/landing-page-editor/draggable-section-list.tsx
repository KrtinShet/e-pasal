'use client';

import { CSS } from '@dnd-kit/utilities';
import type { DragEndEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'motion/react';
import { getSection } from '@baazarify/storefront-builder';
import { Eye, EyeOff, Trash2, GripVertical } from 'lucide-react';
import type { SectionConfig } from '@baazarify/storefront-builder';
import {
  useSensor,
  DndContext,
  useSensors,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface DraggableSectionListProps {
  sections: SectionConfig[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

interface DraggableSectionItemProps {
  section: SectionConfig;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

function DraggableSectionItem({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDelete,
}: DraggableSectionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sectionName = getSection(section.type)?.name || section.type;
  const isHidden = section.visible === false;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={`
        group relative flex items-center gap-3 rounded-xl p-3 cursor-pointer
        transition-all duration-200
        ${isSelected ? 'bg-[var(--color-primary)] bg-opacity-10 ring-2 ring-[var(--color-primary)]' : 'bg-white hover:bg-[var(--grey-50)]'}
        ${isDragging ? 'border-2 border-blue-400 shadow-lg' : 'border border-[var(--grey-200)]'}
        ${isHidden ? 'opacity-40' : 'opacity-100'}
      `}
      onClick={() => onSelect(section.id)}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
        <GripVertical
          className="text-[var(--grey-400)] group-hover:text-[var(--grey-600)]"
          size={18}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[0.8125rem] font-medium text-[var(--grey-800)] truncate">
          {sectionName}
        </p>
      </div>

      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => onToggleVisibility(section.id)}
          className="p-1.5 rounded-lg hover:bg-[var(--grey-100)] transition-colors"
          title={isHidden ? 'Show section' : 'Hide section'}
        >
          {section.visible ? (
            <Eye className="text-[var(--grey-600)]" size={16} />
          ) : (
            <EyeOff className="text-[var(--grey-400)]" size={16} />
          )}
        </button>

        <button
          type="button"
          onClick={() => onDelete(section.id)}
          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          title="Delete section"
        >
          <Trash2 className="text-[var(--grey-400)] hover:text-red-500" size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export function DraggableSectionList({
  sections,
  selectedId,
  onSelect,
  onReorder,
  onToggleVisibility,
  onDelete,
}: DraggableSectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <AnimatePresence>
          <div className="space-y-2">
            {sections.map((section) => (
              <DraggableSectionItem
                key={section.id}
                section={section}
                isSelected={selectedId === section.id}
                onSelect={onSelect}
                onToggleVisibility={onToggleVisibility}
                onDelete={onDelete}
              />
            ))}
          </div>
        </AnimatePresence>
      </SortableContext>
    </DndContext>
  );
}
