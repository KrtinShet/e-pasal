# E06-S05: Theme Persistence and Editor UI

## Summary

Build theme persistence (API + DB) and a theme editor UI for merchants to customize their store appearance.

## Dependencies

- E06-S01, E06-S02, E06-S03

## Tasks

### Task 1: API Endpoints (3 hours)

**In `apps/api`**:

- [ ] `GET /stores/:id/theme` - Get store theme tokens
- [ ] `PUT /stores/:id/theme` - Update theme tokens
- [ ] `POST /stores/:id/theme/reset` - Reset to defaults
- [ ] `POST /stores/:id/theme/preset/:presetName` - Apply preset

**Store schema update**:

```typescript
theme: {
  preset?: string;
  tokens: Partial<ThemeTokens>;
  updatedAt: Date;
}
```

### Task 2: Theme Editor Component (6 hours)

**In Dashboard app or UI package**:

- [ ] `ThemeEditor` - Main container
- [ ] `ColorPicker` - Color selection with constraints
- [ ] `RadiusSlider` - Border radius adjustment
- [ ] `FontSelector` - Typography selection
- [ ] `PresetSelector` - Quick preset application
- [ ] `ThemePreview` - Live preview panel

**Features**:

- Real-time preview (uses ThemeProvider)
- Constraint validation (min/max values)
- Undo/redo
- Save draft vs publish

### Task 3: Landing Page Editor UI (4 hours)

**In Dashboard app**:

- [ ] `PageEditor` - Main editor page
- [ ] `SectionList` - Draggable section list
- [ ] `SectionSettings` - Props editor panel
- [ ] `AddSectionModal` - Section picker
- [ ] `PagePreview` - Preview mode

**Features**:

- Drag to reorder sections
- Toggle section visibility
- Edit section props
- Preview on different devices

### Task 4: Storefront Theme Loading (2 hours)

- [ ] Update storefront layout to fetch store theme
- [ ] Pass theme tokens to ThemeProvider
- [ ] Landing page route uses PageRenderer

## Acceptance Criteria

- [ ] Theme changes persist to database
- [ ] Theme editor shows live preview
- [ ] Constraints prevent invalid values
- [ ] Presets apply correctly
- [ ] Storefront loads store-specific theme
- [ ] Landing page renders from stored config

## Estimate: 15 hours (2 days)
