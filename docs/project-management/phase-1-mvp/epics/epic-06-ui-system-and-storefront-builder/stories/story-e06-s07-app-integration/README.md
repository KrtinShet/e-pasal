# E06-S07: App Integration and Migration

## Summary

Integrate the UI packages into all three apps (admin, dashboard, storefront) and migrate existing styles.

## Dependencies

- E06-S01 through E06-S05

## Tasks

### Task 1: Dashboard Integration (4 hours)

- [ ] Install `@baazarify/ui`
- [ ] Add ThemeProvider to root layout
- [ ] Update Tailwind config to extend UI config
- [ ] Replace globals.css with shared tokens
- [ ] Migrate existing pages to use UI components
- [ ] Implement Dashboard layout

### Task 2: Admin Integration (3 hours)

- [ ] Install `@baazarify/ui`
- [ ] Add ThemeProvider to root layout
- [ ] Update Tailwind config
- [ ] Replace globals.css
- [ ] Implement Dashboard layout (admin variant)

### Task 3: Storefront Integration (4 hours)

- [ ] Install `@baazarify/ui` and `@baazarify/storefront-builder`
- [ ] Add ThemeProvider with store theme loading
- [ ] Update Tailwind config
- [ ] Create landing page route using PageRenderer
- [ ] Keep shop pages using standard components
- [ ] Implement Simple layout for shop pages

### Task 4: Cleanup (2 hours)

- [ ] Remove duplicate styles from apps
- [ ] Remove unused CSS from globals.css files
- [ ] Verify all pages render correctly
- [ ] Check responsive behavior
- [ ] Test theme switching

### Task 5: Documentation (1 hour)

- [ ] Update CLAUDE.md with UI package info
- [ ] Document component usage patterns
- [ ] Add examples to README

## Acceptance Criteria

- [ ] All three apps use `@baazarify/ui`
- [ ] No duplicate component code across apps
- [ ] Theme tokens work consistently
- [ ] Storefront loads store-specific theme
- [ ] Landing page renders from config
- [ ] Shop pages use consistent styling
- [ ] All existing functionality preserved

## Estimate: 14 hours (2 days)
