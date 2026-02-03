# Sprint 1 - Foundation

## Scope

- Sprint ID: SPR-01
- Duration: Weeks 1-2
- Goal: Stand up core platform foundations and complete first product-management workflow in dashboard.

## Committed Stories

| Story ID | Story                                                                                                                                                           | Epic | Planned Window |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | -------------- |
| E01-S01  | [Project setup and monorepo bootstrap](../../epics/epic-01-foundation-and-tenant-core/stories/story-e01-s01-project-bootstrap/README.md)                        | E01  | Week 1 Day 1-2 |
| E01-S02  | [Auth API and merchant registration](../../epics/epic-01-foundation-and-tenant-core/stories/story-e01-s02-auth-and-registration/README.md)                      | E01  | Week 1 Day 3-4 |
| E01-S03  | [Store onboarding and tenant resolution middleware](../../epics/epic-01-foundation-and-tenant-core/stories/story-e01-s03-store-and-tenant-resolution/README.md) | E01  | Week 1 Day 3-4 |
| E01-S04  | [API scaffolding and error-handling baseline](../../epics/epic-01-foundation-and-tenant-core/stories/story-e01-s04-api-scaffolding-and-errors/README.md)        | E01  | Week 1 Day 5   |
| E02-S01  | [Product, category, and inventory APIs](../../epics/epic-02-catalog-and-storefront-commerce/stories/story-e02-s01-product-category-inventory-api/README.md)     | E02  | Week 2 Day 1-3 |
| E02-S02  | [Dashboard product management UI](../../epics/epic-02-catalog-and-storefront-commerce/stories/story-e02-s02-dashboard-product-management-ui/README.md)          | E02  | Week 2 Day 4-5 |

## Exit Criteria

- [x] User can register and create store.
- [x] User can add products with images.
- [x] API handles multi-tenancy correctly.
- [x] Basic unit tests pass.

## Verification Snapshot (2026-02-03)

- Register flow creates both `User` and `Store` in `apps/api/src/modules/auth/auth.service.ts`.
- Product/category APIs and image upload (`/products`, `/categories`, `/upload/images`) are implemented.
- Dashboard product management UI is available at `apps/dashboard/src/app/products/page.tsx`.
- Tenant resolution now handles unknown/inactive tenants with explicit error codes.
- Unit and smoke tests pass: `pnpm --filter @baazarify/api test` (8 files, 15 tests passing).
- API build succeeds: `pnpm --filter @baazarify/api build`.

## Detailed Plan

- [Execution Plan](./execution-plan.md)
