# Storefront Builder v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the basic storefront builder into a modern Framer-inspired visual editor with 3-panel layout, drag-and-drop, device preview, undo/redo, floating toolbars, and framer-motion animations.

**Architecture:** Hybrid section-based builder with element-level editing. Left panel has draggable section layers (dnd-kit), center has canvas with device frames and zoom, right has context-sensitive properties panel. Sections remain the layout primitive; elements within sections become individually selectable with floating toolbars for typography/style editing.

**Tech Stack:** React 19, Next.js 16, @dnd-kit/core + sortable, motion (framer-motion v12, already installed), Tailwind v4, Zod, @baazarify/storefront-builder package (tsup build), @baazarify/ui.

---

## Task Dependency Graph

Tasks are organized in waves for parallel execution:

**Wave 1 (no dependencies — run in parallel):**

- Task 1: Install dependencies
- Task 2: Schema changes (elementStyles on SectionConfig)
- Task 3: useHistory hook (undo/redo)

**Wave 2 (depends on Wave 1):**

- Task 4: Enhanced edit-context (element selection + style overrides)
- Task 5: Canvas component (device frames + zoom)
- Task 6: Draggable section list (dnd-kit)
- Task 7: Properties panel

**Wave 3 (depends on Wave 2):**

- Task 8: Floating element toolbar
- Task 9: Add section panel (replaces modal)
- Task 10: Toolbar component (top bar)
- Task 11: AI chat enhancement

**Wave 4 (depends on all):**

- Task 12: Page editor rewrite (3-panel layout)
- Task 13: Section component updates (all 11 sections)
- Task 14: Animations pass (framer-motion throughout)
- Task 15: Integration testing & polish

---

## Task 1: Install Dependencies

**Files:**

- Modify: `apps/dashboard/package.json`
- Modify: `pnpm-lock.yaml`

**Step 1: Install dnd-kit packages**

```bash
cd /Users/krtinshet/Development/e-pasal
pnpm --filter @baazarify/dashboard add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Step 2: Verify install**

```bash
pnpm --filter @baazarify/dashboard ls @dnd-kit/core
```

Expected: Shows installed version.

**Step 3: Commit**

```bash
git add apps/dashboard/package.json pnpm-lock.yaml
git commit -m "chore: add @dnd-kit dependencies for builder v2"
```

---

## Task 2: Schema Changes — Add elementStyles to SectionConfig

**Files:**

- Modify: `packages/storefront-builder/src/schema/page-schema.ts`
- Modify: `packages/storefront-builder/src/schema/validators.ts`

**Step 1: Update page-schema.ts**

Add `ElementStyleOverride` interface and update `SectionConfig`:

```typescript
// In page-schema.ts, add after existing interfaces:

export interface ElementStyleOverride {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  lineHeight?: string;
}

// Update SectionConfig to add:
export interface SectionConfig {
  id: string;
  type: string;
  props: Record<string, unknown>;
  visible: boolean;
  elementStyles?: Record<string, ElementStyleOverride>;
}
```

**Step 2: Update validators.ts if it has a Zod schema for SectionConfig**

Check `packages/storefront-builder/src/schema/validators.ts` and add `elementStyles` as optional:

```typescript
elementStyles: z.record(z.string(), z.object({
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  color: z.string().optional(),
  textAlign: z.string().optional(),
  padding: z.string().optional(),
  margin: z.string().optional(),
  borderRadius: z.string().optional(),
  lineHeight: z.string().optional(),
})).optional(),
```

**Step 3: Rebuild package**

```bash
cd /Users/krtinshet/Development/e-pasal
pnpm --filter @baazarify/storefront-builder build
```

**Step 4: Commit**

```bash
git add packages/storefront-builder/src/schema/
git commit -m "feat(storefront-builder): add elementStyles to SectionConfig schema"
```

---

## Task 3: useHistory Hook (Undo/Redo)

**Files:**

- Create: `apps/dashboard/src/components/landing-page-editor/use-history.ts`

**Step 1: Create the hook**

```typescript
import { useRef, useState, useCallback } from 'react';

const MAX_HISTORY = 50;

interface HistoryState<T> {
  current: T;
  canUndo: boolean;
  canRedo: boolean;
  set: (value: T) => void;
  undo: () => void;
  redo: () => void;
  reset: (value: T) => void;
}

export function useHistory<T>(initialValue: T): HistoryState<T> {
  const [current, setCurrent] = useState(initialValue);
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);

  const set = useCallback((value: T) => {
    setCurrent((prev) => {
      pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), prev];
      futureRef.current = [];
      return value;
    });
  }, []);

  const undo = useCallback(() => {
    setCurrent((prev) => {
      if (pastRef.current.length === 0) return prev;
      const previous = pastRef.current[pastRef.current.length - 1]!;
      pastRef.current = pastRef.current.slice(0, -1);
      futureRef.current = [prev, ...futureRef.current];
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    setCurrent((prev) => {
      if (futureRef.current.length === 0) return prev;
      const next = futureRef.current[0]!;
      futureRef.current = futureRef.current.slice(1);
      pastRef.current = [...pastRef.current, prev];
      return next;
    });
  }, []);

  const reset = useCallback((value: T) => {
    pastRef.current = [];
    futureRef.current = [];
    setCurrent(value);
  }, []);

  return {
    current,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    set,
    undo,
    redo,
    reset,
  };
}
```

**Step 2: Commit**

```bash
git add apps/dashboard/src/components/landing-page-editor/use-history.ts
git commit -m "feat(dashboard): add useHistory hook for undo/redo"
```

---

## Task 4: Enhanced Edit Context — Element Selection + Style Overrides

**Files:**

- Modify: `packages/storefront-builder/src/renderer/edit-context.tsx`
- Modify: `packages/storefront-builder/src/renderer/edit-mode.tsx`
- Modify: `packages/storefront-builder/src/renderer/index.ts`

**Step 1: Add element selection to edit-context.tsx**

Add to `PageEditContextValue`:

- `selectedElementPath: string | null`
- `onElementSelect: (path: string | null) => void`
- `onElementStyleChange: (sectionId: string, elementPath: string, styles: ElementStyleOverride) => void`

Add to `SectionEditContextValue`:

- `selectElement: (path: string) => void`
- `selectedElementPath: string | null`
- `getElementStyle: (path: string) => ElementStyleOverride | undefined`
- `setElementStyle: (path: string, styles: Partial<ElementStyleOverride>) => void`

Update `PageEditProvider` props to accept these new callbacks.

Update `SectionEditProvider` to wire element selection through context.

Add a new `EditableElement` wrapper component that wraps inline editable elements (text, images, etc.) with click-to-select behavior and applies style overrides from `elementStyles`:

```typescript
export function EditableElement({
  path,
  children,
  className,
}: {
  path: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { editMode, sectionId, selectElement, selectedElementPath, getElementStyle } = useSectionEditor();
  const isSelected = selectedElementPath === path;
  const styles = getElementStyle(path);

  if (!editMode) {
    return <div style={styles as React.CSSProperties} className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        'relative transition-all',
        isSelected && 'ring-2 ring-blue-500 ring-offset-1',
        !isSelected && 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-1',
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(path);
      }}
      style={styles as React.CSSProperties}
    >
      {children}
    </div>
  );
}
```

**Step 2: Update edit-mode.tsx**

Update `EditModeWrapper` to use `framer-motion` for selection animations (import `motion` from `motion/react`). Replace the hard-coded SVG toolbar with a cleaner, animated version:

- Selection ring transitions smoothly (animate ring color/width)
- Section label floats with `AnimatePresence`
- Buttons use lucide-react icons instead of inline SVGs (ChevronUp, ChevronDown, Pencil, Trash2, GripVertical)
- Add a drag handle (GripVertical icon) for dnd-kit integration

**Step 3: Update index.ts exports**

Export `EditableElement` from the renderer index.

**Step 4: Rebuild package**

```bash
pnpm --filter @baazarify/storefront-builder build
```

**Step 5: Commit**

```bash
git add packages/storefront-builder/src/renderer/
git commit -m "feat(storefront-builder): add element selection, style overrides, and EditableElement wrapper"
```

---

## Task 5: Canvas Component (Device Frames + Zoom)

**Files:**

- Create: `apps/dashboard/src/components/landing-page-editor/canvas.tsx`

**Step 1: Create canvas.tsx**

The canvas wraps the `PageRenderer` in a device frame container with zoom support:

```typescript
'use client';

import { useRef, useState, useCallback } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<DeviceMode, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

interface CanvasProps {
  children: React.ReactNode;
  device: DeviceMode;
  zoom: number;
  onDeviceChange: (device: DeviceMode) => void;
  onZoomChange: (zoom: number) => void;
}

export function Canvas({ children, device, zoom, onDeviceChange, onZoomChange }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = DEVICE_WIDTHS[device];
  const scale = zoom / 100;

  // Cmd+scroll for zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -5 : 5;
        onZoomChange(Math.min(150, Math.max(50, zoom + delta)));
      }
    },
    [zoom, onZoomChange],
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-[#f0f0f0] relative"
      onWheel={handleWheel}
      style={{
        backgroundImage:
          'radial-gradient(circle, #d0d0d0 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="flex justify-center py-8 px-4">
        <div
          className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300 origin-top"
          style={{
            width: `${width}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Device frame chrome */}
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-500 text-center">
                yourstore.baazarify.com
              </div>
            </div>
          </div>
          {/* Page content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export { type DeviceMode, DEVICE_WIDTHS };
```

**Step 2: Commit**

```bash
git add apps/dashboard/src/components/landing-page-editor/canvas.tsx
git commit -m "feat(dashboard): add Canvas component with device frames and zoom"
```

---

## Task 6: Draggable Section List (dnd-kit)

**Files:**

- Create: `apps/dashboard/src/components/landing-page-editor/draggable-section-list.tsx`

**Step 1: Create draggable-section-list.tsx**

Replace the old `SectionList` with a dnd-kit sortable list:

```typescript
'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSection, type SectionConfig } from '@baazarify/storefront-builder';

interface DraggableSectionListProps {
  sections: SectionConfig[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

function SortableItem({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDelete,
}: {
  section: SectionConfig;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const definition = getSection(section.type);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[0.8125rem] transition-colors ${
        isDragging
          ? 'z-50 border-blue-400 bg-blue-50 shadow-lg'
          : isSelected
            ? 'border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_8%,white)]'
            : 'border-[var(--grey-200)] bg-white hover:border-[var(--grey-300)]'
      } ${!section.visible ? 'opacity-40' : ''}`}
    >
      <button
        type="button"
        className="cursor-grab text-[var(--grey-400)] hover:text-[var(--grey-600)] active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      <button
        type="button"
        className="flex-1 text-left font-medium text-[var(--grey-800)] truncate"
        onClick={onSelect}
      >
        {definition?.name || section.type}
      </button>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={onToggleVisibility}
          className="rounded-md p-1 text-[var(--grey-400)] hover:bg-[var(--grey-100)] hover:text-[var(--grey-600)]"
        >
          {section.visible ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md p-1 text-[var(--grey-400)] hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={13} />
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
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1.5">
          <AnimatePresence>
            {sections.map((section) => (
              <SortableItem
                key={section.id}
                section={section}
                isSelected={selectedId === section.id}
                onSelect={() => onSelect(section.id)}
                onToggleVisibility={() => onToggleVisibility(section.id)}
                onDelete={() => onDelete(section.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

**Step 2: Commit**

```bash
git add apps/dashboard/src/components/landing-page-editor/draggable-section-list.tsx
git commit -m "feat(dashboard): add DraggableSectionList with dnd-kit sortable"
```

---

## Task 7: Properties Panel

**Files:**

- Create: `apps/dashboard/src/components/landing-page-editor/properties-panel.tsx`

**Step 1: Create properties-panel.tsx**

Context-sensitive right panel that shows section properties or element properties depending on selection:

```typescript
'use client';

import { X, Type, Image, Link2, Palette, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSection, type SectionConfig, type ElementStyleOverride } from '@baazarify/storefront-builder';

interface PropertiesPanelProps {
  selectedSection: SectionConfig | null;
  selectedElementPath: string | null;
  elementStyles: Record<string, ElementStyleOverride> | undefined;
  onSectionPropsChange: (props: Record<string, unknown>) => void;
  onElementStyleChange: (path: string, styles: Partial<ElementStyleOverride>) => void;
  onClose: () => void;
}

function SectionProperties({
  section,
  onChange,
}: {
  section: SectionConfig;
  onChange: (props: Record<string, unknown>) => void;
}) {
  const definition = getSection(section.type);
  const props = section.props;

  const handleChange = (key: string, value: unknown) => {
    onChange({ ...props, [key]: value });
  };

  const editableEntries = Object.entries(props).filter(
    ([key, v]) =>
      key !== 'className' &&
      (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'),
  );

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-[var(--grey-200)]">
        <h3 className="text-[0.8125rem] font-bold text-[var(--grey-800)]">
          {definition?.name || section.type}
        </h3>
        {definition?.description && (
          <p className="mt-1 text-[0.6875rem] text-[var(--grey-500)]">{definition.description}</p>
        )}
      </div>

      {definition?.variants && definition.variants.length > 0 && (
        <div>
          <label className="block text-[0.6875rem] font-semibold text-[var(--grey-600)] mb-2">
            Variant
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {definition.variants.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleChange('variant', v)}
                className={`rounded-lg px-3 py-2 text-[0.75rem] font-medium transition-all ${
                  props.variant === v
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--grey-100)] text-[var(--grey-700)] hover:bg-[var(--grey-200)]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {editableEntries.map(([key, value]) => {
        if (key === 'variant') return null;

        if (typeof value === 'boolean') {
          return (
            <div key={key} className="flex items-center justify-between">
              <label className="text-[0.75rem] text-[var(--grey-700)] capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <button
                type="button"
                onClick={() => handleChange(key, !value)}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  value ? 'bg-[var(--color-primary)]' : 'bg-[var(--grey-300)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    value ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          );
        }

        if (typeof value === 'number') {
          return (
            <div key={key}>
              <label className="block text-[0.6875rem] font-semibold text-[var(--grey-600)] mb-1.5 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleChange(key, Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--grey-200)] bg-white px-3 py-2 text-[0.75rem] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/20"
              />
            </div>
          );
        }

        const isLong = typeof value === 'string' && (value.length > 80 || key === 'description' || key === 'content');
        return (
          <div key={key}>
            <label className="block text-[0.6875rem] font-semibold text-[var(--grey-600)] mb-1.5 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            {isLong ? (
              <textarea
                value={value as string}
                onChange={(e) => handleChange(key, e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[var(--grey-200)] bg-white px-3 py-2 text-[0.75rem] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/20 resize-none"
              />
            ) : (
              <input
                type="text"
                value={value as string}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full rounded-lg border border-[var(--grey-200)] bg-white px-3 py-2 text-[0.75rem] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/20"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ElementProperties({
  path,
  styles,
  onChange,
}: {
  path: string;
  styles: ElementStyleOverride;
  onChange: (styles: Partial<ElementStyleOverride>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-[var(--grey-200)]">
        <h3 className="text-[0.8125rem] font-bold text-[var(--grey-800)]">Element Style</h3>
        <p className="mt-1 text-[0.6875rem] text-[var(--grey-500)]">{path}</p>
      </div>

      {/* Typography */}
      <div>
        <label className="block text-[0.6875rem] font-semibold text-[var(--grey-600)] mb-2">
          Typography
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[0.6rem] text-[var(--grey-500)] mb-1">Size</label>
            <input
              type="text"
              value={styles.fontSize || ''}
              onChange={(e) => onChange({ fontSize: e.target.value || undefined })}
              placeholder="1rem"
              className="w-full rounded-lg border border-[var(--grey-200)] bg-white px-2.5 py-1.5 text-[0.75rem] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[0.6rem] text-[var(--grey-500)] mb-1">Weight</label>
            <select
              value={styles.fontWeight || ''}
              onChange={(e) => onChange({ fontWeight: e.target.value || undefined })}
              className="w-full rounded-lg border border-[var(--grey-200)] bg-white px-2.5 py-1.5 text-[0.75rem] focus:border-[var(--color-primary)] focus:outline-none"
            >
              <option value="">Default</option>
              <option value="300">Light</option>
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
              <option value="800">Extra Bold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-[0.6875rem] font-semibold text-[var(--grey-600)] mb-1.5">
          Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={styles.color || '#000000'}
            onChange={(e) => onChange({ color: e.target.value })}
            className="h-8 w-8 rounded-lg border border-[var(--grey-200)] cursor-pointer"
          />
          <input
            type="text"
            value={styles.color || ''}
            onChange={(e) => onChange({ color: e.target.value || undefined })}
            placeholder="#000000"
            className="flex-1 rounded-lg border border-[var(--grey-200)] bg-white px-2.5 py-1.5 text-[0.75rem] focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Alignment */}
      <div>
        <label className="block text-[0.6875rem] font-semibold text-[var(--grey-600)] mb-1.5">
          Alignment
        </label>
        <div className="flex gap-1">
          {[
            { value: 'left', icon: AlignLeft },
            { value: 'center', icon: AlignCenter },
            { value: 'right', icon: AlignRight },
          ].map(({ value, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ textAlign: value })}
              className={`rounded-lg p-2 transition-colors ${
                styles.textAlign === value
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--grey-100)] text-[var(--grey-600)] hover:bg-[var(--grey-200)]'
              }`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div>
        <label className="block text-[0.6875rem] font-semibold text-[var(--grey-600)] mb-1.5">
          Spacing
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[0.6rem] text-[var(--grey-500)] mb-1">Padding</label>
            <input
              type="text"
              value={styles.padding || ''}
              onChange={(e) => onChange({ padding: e.target.value || undefined })}
              placeholder="0"
              className="w-full rounded-lg border border-[var(--grey-200)] bg-white px-2.5 py-1.5 text-[0.75rem] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[0.6rem] text-[var(--grey-500)] mb-1">Margin</label>
            <input
              type="text"
              value={styles.margin || ''}
              onChange={(e) => onChange({ margin: e.target.value || undefined })}
              placeholder="0"
              className="w-full rounded-lg border border-[var(--grey-200)] bg-white px-2.5 py-1.5 text-[0.75rem] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertiesPanel({
  selectedSection,
  selectedElementPath,
  elementStyles,
  onSectionPropsChange,
  onElementStyleChange,
  onClose,
}: PropertiesPanelProps) {
  const hasSelection = selectedSection || selectedElementPath;

  return (
    <AnimatePresence>
      {hasSelection && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex-shrink-0 border-l border-[var(--grey-200)] bg-white overflow-hidden"
        >
          <div className="w-[320px] h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-[var(--grey-200)] px-4 py-3">
              <h3 className="text-[0.8125rem] font-bold text-[var(--grey-800)]">
                {selectedElementPath ? 'Element' : 'Section'} Properties
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-[var(--grey-400)] hover:bg-[var(--grey-100)] hover:text-[var(--grey-600)]"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto thin-scroll p-4">
              {selectedElementPath && selectedSection ? (
                <ElementProperties
                  path={selectedElementPath}
                  styles={elementStyles?.[selectedElementPath] || {}}
                  onChange={(styles) => onElementStyleChange(selectedElementPath, styles)}
                />
              ) : selectedSection ? (
                <SectionProperties section={selectedSection} onChange={onSectionPropsChange} />
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Commit**

```bash
git add apps/dashboard/src/components/landing-page-editor/properties-panel.tsx
git commit -m "feat(dashboard): add PropertiesPanel with section and element editing"
```

---

## Task 8: Floating Element Toolbar

**Files:**

- Create: `apps/dashboard/src/components/landing-page-editor/element-toolbar.tsx`

**Step 1: Create element-toolbar.tsx**

A floating toolbar that appears above selected elements with quick actions:

```typescript
'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Type, Palette, Trash2 } from 'lucide-react';
import type { ElementStyleOverride } from '@baazarify/storefront-builder';

interface ElementToolbarProps {
  visible: boolean;
  position: { top: number; left: number; width: number };
  styles: ElementStyleOverride;
  onStyleChange: (styles: Partial<ElementStyleOverride>) => void;
  onDelete?: () => void;
}

export function ElementToolbar({ visible, position, styles, onStyleChange, onDelete }: ElementToolbarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[100] flex items-center gap-0.5 rounded-xl border border-[var(--grey-200)] bg-white px-1.5 py-1 shadow-lg"
          style={{
            top: `${position.top - 44}px`,
            left: `${position.left + position.width / 2}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Font size quick adjust */}
          <select
            value={styles.fontSize || ''}
            onChange={(e) => onStyleChange({ fontSize: e.target.value || undefined })}
            className="rounded-md border-none bg-[var(--grey-50)] px-2 py-1 text-[0.6875rem] font-medium text-[var(--grey-700)] focus:outline-none"
          >
            <option value="">Size</option>
            <option value="0.75rem">12</option>
            <option value="0.875rem">14</option>
            <option value="1rem">16</option>
            <option value="1.125rem">18</option>
            <option value="1.25rem">20</option>
            <option value="1.5rem">24</option>
            <option value="2rem">32</option>
            <option value="2.5rem">40</option>
            <option value="3rem">48</option>
          </select>

          <div className="h-4 w-px bg-[var(--grey-200)]" />

          {/* Bold toggle */}
          <button
            type="button"
            onClick={() => onStyleChange({ fontWeight: styles.fontWeight === '700' ? undefined : '700' })}
            className={`rounded-md p-1.5 transition-colors ${
              styles.fontWeight === '700'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--grey-600)] hover:bg-[var(--grey-100)]'
            }`}
          >
            <Bold size={13} />
          </button>

          <div className="h-4 w-px bg-[var(--grey-200)]" />

          {/* Alignment */}
          {[
            { value: 'left', icon: AlignLeft },
            { value: 'center', icon: AlignCenter },
            { value: 'right', icon: AlignRight },
          ].map(({ value, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onStyleChange({ textAlign: value })}
              className={`rounded-md p-1.5 transition-colors ${
                styles.textAlign === value
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--grey-600)] hover:bg-[var(--grey-100)]'
              }`}
            >
              <Icon size={13} />
            </button>
          ))}

          <div className="h-4 w-px bg-[var(--grey-200)]" />

          {/* Color picker */}
          <label className="relative cursor-pointer rounded-md p-1.5 text-[var(--grey-600)] hover:bg-[var(--grey-100)]">
            <Palette size={13} />
            <input
              type="color"
              value={styles.color || '#000000'}
              onChange={(e) => onStyleChange({ color: e.target.value })}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Commit**

```bash
git add apps/dashboard/src/components/landing-page-editor/element-toolbar.tsx
git commit -m "feat(dashboard): add floating ElementToolbar for inline styling"
```

---

## Task 9: Add Section Panel (Replaces Modal)

**Files:**

- Create: `apps/dashboard/src/components/landing-page-editor/add-section-panel.tsx`

**Step 1: Create add-section-panel.tsx**

A slide-out panel from the left with visual section thumbnails, categories, and search:

```typescript
'use client';

import { useState } from 'react';
import { X, Search, Layout, ShoppingBag, MessageSquare, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAllSections, type SectionDefinition } from '@baazarify/storefront-builder';

interface AddSectionPanelProps {
  open: boolean;
  onClose: () => void;
  onAdd: (type: string) => void;
}

const categoryConfig: Record<string, { label: string; icon: typeof Layout }> = {
  content: { label: 'Content', icon: Layout },
  commerce: { label: 'Commerce', icon: ShoppingBag },
  social: { label: 'Social Proof', icon: MessageSquare },
  utility: { label: 'Utility', icon: Settings },
};

const sectionColors: Record<string, string> = {
  hero: 'from-blue-500 to-purple-500',
  features: 'from-emerald-500 to-teal-500',
  about: 'from-amber-500 to-orange-500',
  testimonials: 'from-pink-500 to-rose-500',
  cta: 'from-violet-500 to-indigo-500',
  faq: 'from-cyan-500 to-blue-500',
  contact: 'from-green-500 to-emerald-500',
  gallery: 'from-fuchsia-500 to-pink-500',
  stats: 'from-yellow-500 to-amber-500',
  newsletter: 'from-sky-500 to-cyan-500',
  'product-grid': 'from-red-500 to-orange-500',
};

export function AddSectionPanel({ open, onClose, onAdd }: AddSectionPanelProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const sections = getAllSections();
  const filtered = sections.filter((s) => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(sections.map((s) => s.category))];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 h-full w-[380px] bg-white shadow-2xl border-r border-[var(--grey-200)]"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--grey-200)] px-5 py-4">
                <h2 className="text-[0.9375rem] font-bold text-[var(--grey-900)]">Add Section</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-[var(--grey-400)] hover:bg-[var(--grey-100)] hover:text-[var(--grey-600)]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search */}
              <div className="border-b border-[var(--grey-200)] px-5 py-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--grey-400)]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search sections..."
                    className="w-full rounded-xl border border-[var(--grey-200)] bg-[var(--grey-50)] pl-9 pr-3 py-2.5 text-[0.8125rem] placeholder:text-[var(--grey-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/20"
                  />
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex gap-1.5 border-b border-[var(--grey-200)] px-5 py-3 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className={`rounded-lg px-3 py-1.5 text-[0.6875rem] font-semibold whitespace-nowrap transition-colors ${
                    !activeCategory
                      ? 'bg-[var(--grey-900)] text-white'
                      : 'bg-[var(--grey-100)] text-[var(--grey-600)] hover:bg-[var(--grey-200)]'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => {
                  const config = categoryConfig[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-[0.6875rem] font-semibold whitespace-nowrap transition-colors ${
                        activeCategory === cat
                          ? 'bg-[var(--grey-900)] text-white'
                          : 'bg-[var(--grey-100)] text-[var(--grey-600)] hover:bg-[var(--grey-200)]'
                      }`}
                    >
                      {config?.label || cat}
                    </button>
                  );
                })}
              </div>

              {/* Section grid */}
              <div className="flex-1 overflow-y-auto thin-scroll p-5">
                <div className="grid grid-cols-2 gap-3">
                  {filtered.map((section) => (
                    <motion.button
                      key={section.type}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onAdd(section.type);
                        onClose();
                      }}
                      className="group flex flex-col overflow-hidden rounded-xl border border-[var(--grey-200)] bg-white transition-all hover:border-[var(--grey-300)] hover:shadow-md"
                    >
                      {/* Visual preview thumbnail */}
                      <div className={`h-20 w-full bg-gradient-to-br ${sectionColors[section.type] || 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                        <span className="text-[1.5rem] font-bold text-white/30 uppercase tracking-wider">
                          {section.type.slice(0, 2)}
                        </span>
                      </div>
                      <div className="p-3 text-left">
                        <p className="text-[0.75rem] font-semibold text-[var(--grey-800)]">
                          {section.name}
                        </p>
                        <p className="mt-0.5 text-[0.625rem] text-[var(--grey-500)] line-clamp-2">
                          {section.description}
                        </p>
                        {section.variants && section.variants.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {section.variants.map((v) => (
                              <span
                                key={v}
                                className="rounded-md bg-[var(--grey-100)] px-1.5 py-0.5 text-[0.5625rem] font-medium text-[var(--grey-500)]"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Commit**

```bash
git add apps/dashboard/src/components/landing-page-editor/add-section-panel.tsx
git commit -m "feat(dashboard): add visual AddSectionPanel with thumbnails and categories"
```

---

## Task 10: Toolbar Component (Top Bar)

**Files:**

- Create: `apps/dashboard/src/components/landing-page-editor/toolbar.tsx`

**Step 1: Create toolbar.tsx**

Top toolbar with undo/redo, device toggle, zoom, save status, and publish:

```typescript
'use client';

import { Undo2, Redo2, Monitor, Tablet, Smartphone, Minus, Plus, Sparkles, Save } from 'lucide-react';
import type { DeviceMode } from './canvas';

interface ToolbarProps {
  device: DeviceMode;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  saving: boolean;
  publishing: boolean;
  hasUnsavedChanges: boolean;
  savedText: string;
  onDeviceChange: (device: DeviceMode) => void;
  onZoomChange: (zoom: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPublish: () => void;
  onAIGenerate: () => void;
}

export function Toolbar({
  device,
  zoom,
  canUndo,
  canRedo,
  saving,
  publishing,
  hasUnsavedChanges,
  savedText,
  onDeviceChange,
  onZoomChange,
  onUndo,
  onRedo,
  onSave,
  onPublish,
  onAIGenerate,
}: ToolbarProps) {
  const devices: { mode: DeviceMode; icon: typeof Monitor; label: string }[] = [
    { mode: 'desktop', icon: Monitor, label: 'Desktop' },
    { mode: 'tablet', icon: Tablet, label: 'Tablet' },
    { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <div className="flex items-center justify-between border-b border-[var(--grey-200)] bg-white px-4 py-2">
      {/* Left: undo/redo */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-lg p-2 text-[var(--grey-600)] transition-colors hover:bg-[var(--grey-100)] disabled:opacity-30"
          title="Undo (Cmd+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="rounded-lg p-2 text-[var(--grey-600)] transition-colors hover:bg-[var(--grey-100)] disabled:opacity-30"
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo2 size={16} />
        </button>

        <div className="mx-2 h-5 w-px bg-[var(--grey-200)]" />

        <span className="text-[0.6875rem] text-[var(--grey-500)]">{savedText}</span>
      </div>

      {/* Center: device toggle + zoom */}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-[var(--grey-200)] bg-[var(--grey-50)] p-0.5">
          {devices.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => onDeviceChange(mode)}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                device === mode
                  ? 'bg-white text-[var(--grey-900)] shadow-sm'
                  : 'text-[var(--grey-500)] hover:text-[var(--grey-700)]'
              }`}
              title={label}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-[var(--grey-200)] bg-[var(--grey-50)] px-2 py-0.5">
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            className="rounded-md p-1 text-[var(--grey-500)] hover:bg-[var(--grey-200)]"
          >
            <Minus size={12} />
          </button>
          <span className="min-w-[3rem] text-center text-[0.6875rem] font-medium text-[var(--grey-700)]">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(150, zoom + 10))}
            className="rounded-md p-1 text-[var(--grey-500)] hover:bg-[var(--grey-200)]"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAIGenerate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--warning-main)] px-3.5 py-2 text-[0.75rem] font-bold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.97]"
        >
          <Sparkles size={13} />
          AI Generate
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving || publishing || !hasUnsavedChanges}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--grey-200)] px-3.5 py-2 text-[0.75rem] font-semibold text-[var(--grey-700)] transition-all hover:bg-[var(--grey-50)] disabled:opacity-40"
        >
          <Save size={13} />
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          className="rounded-xl bg-[var(--success-main)] px-4 py-2 text-[0.75rem] font-bold text-white shadow-sm transition-all hover:bg-[var(--success-dark)] disabled:opacity-40 active:scale-[0.97]"
        >
          {publishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/dashboard/src/components/landing-page-editor/toolbar.tsx
git commit -m "feat(dashboard): add Toolbar with undo/redo, device toggle, and zoom controls"
```

---

## Task 11: AI Chat Enhancement

**Files:**

- Modify: `apps/dashboard/src/components/landing-page-editor/ai-chat.tsx`

**Step 1: Update ai-chat.tsx**

Enhance the AI chat to be section-aware when a section is selected. Keep the existing chat bar but add context about the selected section. Update the API call to pass section context for targeted editing rather than full page regeneration.

Key changes:

- Accept `selectedSectionId` and `selectedSectionType` props
- When a section is selected, show a context chip like "Editing: Hero Section"
- The AI prompt includes section context so the API can modify just that section
- Add a subtle expand/collapse animation for the chat thread
- Wrap messages with `motion.div` for enter/exit animations

**Step 2: Commit**

```bash
git add apps/dashboard/src/components/landing-page-editor/ai-chat.tsx
git commit -m "feat(dashboard): enhance AI chat with section-aware editing"
```

---

## Task 12: Page Editor Rewrite (3-Panel Layout)

**Files:**

- Modify: `apps/dashboard/src/components/landing-page-editor/page-editor.tsx`
- Delete (contents merged): `apps/dashboard/src/components/landing-page-editor/section-settings.tsx`
- Delete (replaced): `apps/dashboard/src/components/landing-page-editor/section-list.tsx`
- Delete (replaced): `apps/dashboard/src/components/landing-page-editor/add-section-modal.tsx`

**Step 1: Rewrite page-editor.tsx**

Complete rewrite using the new components:

Layout structure:

```
PageEditor
├── Page tabs (top)
├── Toolbar (device, zoom, undo/redo, save, publish)
├── 3-panel body
│   ├── Left: DraggableSectionList + Add button
│   ├── Center: Canvas > PageRenderer
│   └── Right: PropertiesPanel (animated in/out)
├── AIChat (bottom)
├── AddSectionPanel (overlay, replaces modal)
└── AIGenerateModal (keep existing)
```

Key integration points:

- Use `useHistory` hook for the `pages` state array — `history.set()` instead of `setPages()`, `history.undo/redo`
- Wire keyboard shortcuts: `useEffect` for Cmd+Z (undo), Cmd+Shift+Z (redo)
- Wire `DraggableSectionList` `onReorder` to reorder sections by finding indices from IDs using `arrayMove` from `@dnd-kit/sortable`
- Wire `Canvas` component around `PageRenderer`
- Wire `PropertiesPanel` with selected section/element state
- Wire `Toolbar` with device/zoom state, undo/redo, save/publish
- Replace `AddSectionModal` with `AddSectionPanel`
- Track `selectedElementPath` state alongside `selectedSectionId`
- Track `device` (DeviceMode) and `zoom` (number) state

**Step 2: Remove old files**

Delete `section-settings.tsx`, `section-list.tsx`, `add-section-modal.tsx` (functionality merged into new components).

**Step 3: Build and verify**

```bash
pnpm --filter @baazarify/dashboard build
```

**Step 4: Commit**

```bash
git add apps/dashboard/src/components/landing-page-editor/
git commit -m "feat(dashboard): rewrite PageEditor with 3-panel Framer-inspired layout"
```

---

## Task 13: Section Component Updates (All 11 Sections)

**Files:**

- Modify: All 11 section components in `packages/storefront-builder/src/sections/*/`

**Step 1: Update each section component**

For each of the 11 section components (hero, features, about, cta, faq, contact, gallery, newsletter, product-grid, stats, testimonials):

1. Wrap key editable elements with `EditableElement` to enable element-level selection
2. Apply `elementStyles` from section config as inline styles
3. Add `motion.div` wrappers for entrance animations (fade + slide up) on scroll

Pattern for wrapping an InlineText with EditableElement:

```typescript
// Before:
<InlineText path="headline" value={headline} as="h1" className="..." />

// After:
<EditableElement path="headline">
  <InlineText path="headline" value={headline} as="h1" className="..." />
</EditableElement>
```

**Step 2: Rebuild package**

```bash
pnpm --filter @baazarify/storefront-builder build
```

**Step 3: Commit**

```bash
git add packages/storefront-builder/src/sections/
git commit -m "feat(storefront-builder): add EditableElement wrappers and element-level selection to all sections"
```

---

## Task 14: Animations Pass (framer-motion Throughout)

**Files:**

- Modify: Multiple dashboard and storefront-builder components

**Step 1: Add animations**

Apply framer-motion animations throughout:

1. **Page editor mount**: Fade in entire editor on load
2. **Section add**: New sections slide in from below with spring animation
3. **Section delete**: Section fades out and collapses with `AnimatePresence` + `layout`
4. **Panel open/close**: Right panel slides in/out (already done in PropertiesPanel)
5. **Toast notifications**: Slide up from bottom with auto-dismiss
6. **Section drag**: Smooth layout animation during reorder (already done with `layout` prop)
7. **Canvas device switch**: Width transitions smoothly between device frames
8. **Add section panel**: Slide in from left (already done)

Key areas to touch:

- `page-editor.tsx`: Wrap section list items and page content with `motion.div` + `layout`
- `canvas.tsx`: Animate width/scale transitions on device change
- `edit-mode.tsx`: Animate selection ring and floating toolbar appearance

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add framer-motion animations throughout builder v2"
```

---

## Task 15: Integration Testing & Polish

**Files:**

- Modify: `apps/dashboard/src/app/(dashboard)/store/landing-page/page.tsx`
- Various polish across all new components

**Step 1: Update the landing page route**

Remove the `PageHeader` wrapper (the new editor is full-viewport) and pass through props correctly.

**Step 2: Full build verification**

```bash
pnpm --filter @baazarify/storefront-builder build
pnpm --filter @baazarify/dashboard build
```

**Step 3: Visual testing checklist**

Run `pnpm dev:dashboard` and verify:

- [ ] 3-panel layout renders correctly
- [ ] Left panel shows draggable section list
- [ ] Drag-and-drop reorders sections
- [ ] Canvas shows device frame (desktop/tablet/mobile toggle)
- [ ] Zoom slider works (50%-150%)
- [ ] Cmd+scroll zooms canvas
- [ ] Clicking a section selects it (ring outline)
- [ ] Right panel shows section properties when selected
- [ ] Clicking an element within a section selects it
- [ ] Floating toolbar appears for selected elements
- [ ] Element style changes (font size, color, alignment) apply in real-time
- [ ] Undo/redo works (Cmd+Z / Cmd+Shift+Z)
- [ ] Add section panel slides out with visual thumbnails
- [ ] Adding a section animates it into position
- [ ] Deleting a section animates it out
- [ ] Auto-save works (1.4s debounce)
- [ ] Publish button works
- [ ] AI chat bar works
- [ ] AI Generate modal works
- [ ] Page tabs work (multi-page)
- [ ] No console errors

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: storefront builder v2 — Framer-inspired visual editor complete"
```

---

Plan complete and saved to `docs/plans/2026-02-15-storefront-builder-v2-plan.md`. Two execution options:

**1. Subagent-Driven (this session)** — I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** — Open new session with executing-plans, batch execution with checkpoints

Which approach?

<function_calls>
<invoke name="AskUserQuestion">
<parameter name="questions">[{"question": "How should we execute this plan?", "header": "Execution", "options": [{"label": "Parallel team (Recommended)", "description": "Spin up a team of agents working in parallel waves as described in the plan. Fastest execution."}, {"label": "Subagent-driven (this session)", "description": "One task at a time with review between each. Slower but more control."}, {"label": "Parallel session (separate)", "description": "Open a new session to batch execute with checkpoints."}], "multiSelect": false}]
