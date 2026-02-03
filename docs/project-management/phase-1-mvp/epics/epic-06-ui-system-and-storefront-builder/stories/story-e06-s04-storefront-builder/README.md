# E06-S04: Storefront Builder Package and Sections

## Summary

Create `@baazarify/storefront-builder` package with section-based landing page builder.

## Dependencies

- E06-S01, E06-S02

## Tasks

### Task 1: Initialize Package (1 hour)

```bash
mkdir -p packages/storefront-builder/src/{sections,schema,renderer,ai}
```

- [ ] `packages/storefront-builder/package.json`
- [ ] `packages/storefront-builder/tsconfig.json`
- [ ] `packages/storefront-builder/tsup.config.ts`

### Task 2: Page Schema (2 hours)

- [ ] `src/schema/page-schema.ts` - PageConfig, SectionConfig types
- [ ] `src/schema/section-registry.ts` - Section definitions
- [ ] `src/schema/validators.ts` - Zod validation schemas
- [ ] `src/schema/index.ts`

### Task 3: Priority 1 Sections (8 hours)

| Section      | Files                                              | Estimate |
| ------------ | -------------------------------------------------- | -------- |
| Hero         | hero-section.tsx, hero-schema.ts, hero-variants.ts | 2h       |
| Product Grid | product-grid-section.tsx, product-grid-schema.ts   | 1.5h     |
| Features     | features-section.tsx, features-schema.ts           | 1.5h     |
| Testimonials | testimonials-section.tsx, testimonials-schema.ts   | 1.5h     |
| CTA          | cta-section.tsx, cta-schema.ts                     | 1h       |
| Newsletter   | newsletter-section.tsx, newsletter-schema.ts       | 0.5h     |

Each section needs:

- Component implementation
- Props schema (for AI/validation)
- Default props
- Variants (where applicable)

### Task 4: Priority 2 Sections (6 hours)

| Section | Estimate |
| ------- | -------- |
| About   | 1h       |
| Contact | 1.5h     |
| FAQ     | 1h       |
| Gallery | 1.5h     |
| Stats   | 1h       |

### Task 5: Page Renderer (3 hours)

- [ ] `src/renderer/page-renderer.tsx` - Main renderer
- [ ] `src/renderer/section-renderer.tsx` - Section wrapper
- [ ] `src/renderer/edit-mode.tsx` - Edit mode overlay
- [ ] `src/renderer/index.ts`

### Task 6: Package Exports (30 min)

- [ ] `src/index.ts` - Main entry
- [ ] Export sections, schema, renderer

## Acceptance Criteria

- [ ] Package builds successfully
- [ ] All Priority 1 sections render correctly
- [ ] PageRenderer takes config and renders sections
- [ ] Edit mode shows section boundaries
- [ ] Section schemas are complete for AI consumption

## Estimate: 20 hours (3 days)
