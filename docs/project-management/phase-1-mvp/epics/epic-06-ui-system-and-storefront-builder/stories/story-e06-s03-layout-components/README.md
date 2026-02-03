# E06-S03: Layout Components

## Summary

Implement shared layout components: Dashboard, Auth, and Simple layouts.

## Dependencies

- E06-S01, E06-S02

## Tasks

### Task 1: Dashboard Layout (4 hours)

**Reference**: Minima `/src/layouts/dashboard/`

- [ ] `src/layouts/dashboard/dashboard-layout.tsx`
- [ ] `src/layouts/dashboard/sidebar.tsx`
- [ ] `src/layouts/dashboard/header.tsx`
- [ ] `src/layouts/dashboard/nav-item.tsx`
- [ ] `src/layouts/dashboard/mobile-nav.tsx`
- [ ] `src/layouts/dashboard/index.ts`

**Features**:

- Collapsible sidebar (mini mode)
- Mobile responsive (drawer)
- User dropdown
- Notification area placeholder
- Theme toggle

### Task 2: Auth Layout (2 hours)

**Reference**: Minima `/src/layouts/auth/`

- [ ] `src/layouts/auth/auth-layout.tsx`
- [ ] `src/layouts/auth/index.ts`

**Variants**: split (image + form), centered

### Task 3: Simple Layout (1 hour)

- [ ] `src/layouts/simple/simple-layout.tsx`
- [ ] `src/layouts/simple/index.ts`

Header + footer only, for public/marketing pages.

### Task 4: Update Exports (30 min)

- [ ] Export all layouts from `src/layouts/index.ts`
- [ ] Export from main package index

## Acceptance Criteria

- [ ] Dashboard layout works with configurable nav items
- [ ] Sidebar collapses to mini mode
- [ ] Mobile nav works as drawer
- [ ] Auth layout centers content
- [ ] Simple layout has sticky header
- [ ] All layouts use theme tokens

## Estimate: 8 hours
