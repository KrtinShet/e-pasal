# SPR-02 Execution Plan

## Week 3 Day 1-2

- [x] [E06-S01 - UI Package Foundation and Token System](../../epics/epic-06-ui-system-and-storefront-builder/stories/story-e06-s01-ui-package-foundation/tasks.md)
- [x] [E02-S03 - Storefront subdomain routing and base layout](../../epics/epic-02-catalog-and-storefront-commerce/stories/story-e02-s03-storefront-subdomain-layout/tasks.md)

## Week 3 Day 3-4

- [x] [E02-S04 - Storefront catalog browsing and product pages](../../epics/epic-02-catalog-and-storefront-commerce/stories/story-e02-s04-storefront-catalog-browsing/tasks.md)

## Week 3 Day 3-5

- [ ] [E06-S02 - Core Components (Button, Input, Card, etc.)](../../epics/epic-06-ui-system-and-storefront-builder/stories/story-e06-s02-core-components/tasks.md) (Partial - ~50%)

## Week 3 Day 5

- [x] [E02-S05 - Storefront SEO baseline](../../epics/epic-02-catalog-and-storefront-commerce/stories/story-e02-s05-storefront-seo-baseline/tasks.md)

## Week 4 Day 1-2

- [x] [E06-S03 - Layout Components (Dashboard, Auth, Simple)](../../epics/epic-06-ui-system-and-storefront-builder/stories/story-e06-s03-layout-components/tasks.md)
- [x] [E02-S06 - Cart experience and state management](../../epics/epic-02-catalog-and-storefront-commerce/stories/story-e02-s06-cart-state-and-ui/tasks.md)

## Week 4 Day 3-5

- [x] [E02-S07 - Checkout and cash-on-delivery order placement](../../epics/epic-02-catalog-and-storefront-commerce/stories/story-e02-s07-checkout-and-cod-orders/tasks.md)

## Sprint Cadence

- Daily standup: track blockers and story progress.
- Mid-sprint review: re-plan only if exit criteria are at risk.
- Sprint demo and retrospective: capture carry-over decisions explicitly.

## Verification Snapshot (2026-02-03)

### Completed

- **E06-S01**: Token system with 6 presets, ThemeProvider, CSS variable generator, Tailwind config
- **E02-S03**: Subdomain middleware, store context, header/footer, mobile nav
- **E02-S04**: Product grid, filters, pagination, product detail page, ISR
- **E02-S05**: Metadata generators, sitemap, robots.txt, JSON-LD components
- **E06-S03**: Dashboard layout with sidebar, Auth layout, Simple layout
- **E02-S06**: Cart context with localStorage persistence, cart drawer, cart page
- **E02-S07**: Checkout page with form, confirmation page, order types

### Partial

- **E06-S02**: Button, Input, Select, Card, Badge, Avatar, Checkbox, Switch, Textarea, Alert, Skeleton, Spinner implemented. Still pending: Radio, Table, Modal, Popover, Dropdown, Toast, Tabs, Breadcrumbs

### Key Files

- `packages/ui/src/` - UI package with tokens, components, and layouts
- `apps/storefront/src/app/checkout/` - Checkout flow
- `apps/storefront/src/components/cart/` - Cart components
- `apps/storefront/src/components/seo/` - SEO components
