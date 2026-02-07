# E08 - Design System Consolidation

Consolidate 3 parallel styling systems into one unified design token foundation. Rebuild dashboard layout with Minima-inspired architecture, align all apps to shared tokens.

## Priority

**CRITICAL** - Dashboard layout was broken, colors/spacing inconsistent across apps.

## Sprint Coverage

- Sprint 3 (completed 2026-02-07)

## Dependencies

- E06 UI System (completed) - provides base component library
- E07 Landing/Auth (completed) - pages to align

## Stories

| Story ID | Story                                                                                             | Sprint   | Status |
| -------- | ------------------------------------------------------------------------------------------------- | -------- | ------ |
| E08-S01  | [Unified Design Tokens & CSS Foundation](./stories/story-e08-s01-unified-design-tokens/README.md) | Sprint 3 | Done   |
| E08-S02  | [Dashboard Layout Rebuild](./stories/story-e08-s02-dashboard-layout-rebuild/README.md)            | Sprint 3 | Done   |
| E08-S03  | [Landing & Auth Styling Alignment](./stories/story-e08-s03-landing-auth-alignment/README.md)      | Sprint 3 | Done   |
| E08-S04  | [Admin Panel Layout](./stories/story-e08-s04-admin-panel-layout/README.md)                        | Sprint 3 | Done   |
| E08-S05  | [Storefront Styling Alignment](./stories/story-e08-s05-storefront-alignment/README.md)            | Sprint 3 | Done   |
| E08-S06  | [Cross-App QA & Polish](./stories/story-e08-s06-cross-app-qa/README.md)                           | Sprint 3 | Done   |

## Key Deliverables

1. `packages/ui/src/styles/` - Unified token system (config-layout, palette, typography, shadows, css-utils, global-tokens.css)
2. `@baazarify/ui/styles` - Single CSS import for all apps
3. Dashboard layout rebuilt with Minima-inspired architecture (layout constants, lucide-react icons)
4. Admin panel with DashboardLayout, route groups, stub pages
5. All app globals.css consolidated to import shared tokens
6. Products page moved into (dashboard) route group

## Progress Snapshot

- [x] E08-S01 Done
- [x] E08-S02 Done
- [x] E08-S03 Done
- [x] E08-S04 Done
- [x] E08-S05 Done
- [x] E08-S06 Done

## Story Folder

- [Story Index](./stories/README.md)
