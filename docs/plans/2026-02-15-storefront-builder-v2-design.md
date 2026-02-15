# Storefront Builder v2 — Framer-Inspired Redesign

**Date:** 2026-02-15
**Status:** Approved

## Overview

Redesign the storefront landing page builder from a basic section-list editor to a modern, Framer-inspired visual builder. Hybrid approach: section-based layout with grid/flex element editing within sections.

## Architecture

### Editor Layout (3-Panel)

```
+--[ Toolbar: device toggle, zoom, undo/redo, publish ]--+
|  Left Panel  |     Canvas (device frame)           | Right Panel |
|  240px       |     flex-1, scrollable              | 320px       |
|              |                                     |             |
|  Page tabs   |  Sections rendered in device frame  | Section     |
|  Section     |  with selection overlays            | Properties  |
|  layers      |                                     |             |
|  (drag to    |                                     | Element     |
|   reorder)   |                                     | Properties  |
|              |                                     |             |
|  + Add       |                                     |             |
+--------------+-------------------------------------+-------------+
|        AI Chat Bar (collapsible bottom)                          |
+-----------------------------------------------------------------+
```

### Canvas & Device Preview

- Sections rendered in a scaled container with `transform: scale()` + `transform-origin: top center`
- Device frames: Desktop (1280px), Tablet (768px), Mobile (375px)
- Zoom: 50%–150% via slider or Cmd+scroll
- Centered in canvas area with subtle background grid

### Drag-and-Drop (dnd-kit)

- `@dnd-kit/core` + `@dnd-kit/sortable` for section reordering
- Drag in left panel layers list
- Drop indicators between sections
- Smooth layout animations via framer-motion

### Selection & Floating Toolbar

Click an element within a section → blue selection outline + floating toolbar:

- **Text:** font size, weight, color, alignment
- **Image:** src, alt, fit, border-radius
- **Button/Link:** text, href, style variant
- **Spacing:** padding/margin nudge controls

### Right Properties Panel

**Section selected:** variant (visual thumbnails), background, padding, visibility
**Element selected:** type-specific controls, typography, layout, advanced

### Undo/Redo

- History stack of PageConfig snapshots
- Cmd+Z / Cmd+Shift+Z
- Max 50 history entries

### Add Section Panel

Slide-out from left panel (replaces modal):

- Visual thumbnails per section type
- Category tabs
- Search/filter
- Click to add with animation

### Animations (framer-motion)

- Section add/remove: slide + fade
- Panel transitions: spring
- Selection outlines: smooth
- Drag reorder: layout animations
- Toasts: slide up/down

### AI Chat Enhancement

- Section-aware editing (modify selected section, not just whole page)
- Better conversational UX

### Schema Changes

Add optional `elementStyles` to `SectionConfig`:

```typescript
interface SectionConfig {
  id: string;
  type: string;
  props: Record<string, unknown>;
  visible: boolean;
  elementStyles?: Record<string, ElementStyleOverride>; // NEW
}

interface ElementStyleOverride {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
}
```

### Dependencies

- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- `framer-motion`

### Files

**New (dashboard):**

- `components/landing-page-editor/canvas.tsx`
- `components/landing-page-editor/toolbar.tsx`
- `components/landing-page-editor/properties-panel.tsx`
- `components/landing-page-editor/element-toolbar.tsx`
- `components/landing-page-editor/draggable-section-list.tsx`
- `components/landing-page-editor/add-section-panel.tsx`
- `components/landing-page-editor/use-history.ts`

**Modified (dashboard):**

- `page-editor.tsx` — complete rewrite to 3-panel layout
- `section-settings.tsx` → merged into properties-panel
- `ai-chat.tsx` — section-aware editing

**Modified (storefront-builder):**

- `edit-mode.tsx` — element-level selection
- `edit-context.tsx` — element selection + style overrides
- `page-schema.ts` — add `elementStyles`
- All 11 section components — selectable element wrappers
