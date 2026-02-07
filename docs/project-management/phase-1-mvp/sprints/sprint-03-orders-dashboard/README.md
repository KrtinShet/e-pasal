# Sprint 3 - Orders and Dashboard

## Scope

- Sprint ID: SPR-03
- Duration: Weeks 5-6
- Goal: Make order operations and merchant dashboard production-ready. Deliver storefront builder and theme customization.

## Committed Stories

| Story ID | Story                                                                                                                                                                 | Epic | Planned Window | Priority |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | -------------- | -------- |
| E07-S01  | [Platform Landing Page](../../epics/epic-07-landing-and-auth/stories/story-e07-s01-landing-page/README.md)                                                            | E07  | Week 5 Day 1   | HIGH     |
| E07-S02  | [Merchant Auth Pages](../../epics/epic-07-landing-and-auth/stories/story-e07-s02-auth-pages/README.md)                                                                | E07  | Week 5 Day 1-2 | HIGH     |
| E07-S03  | [Merchant Onboarding Flow](../../epics/epic-07-landing-and-auth/stories/story-e07-s03-onboarding/README.md)                                                           | E07  | Week 5 Day 2-3 | HIGH     |
| E06-S04  | [Storefront Builder Package and Sections](../../epics/epic-06-ui-system-and-storefront-builder/stories/story-e06-s04-storefront-builder/README.md)                    | E06  | Week 5 Day 3-4 |          |
| E03-S01  | [Orders API, timeline, and inventory reservation](../../epics/epic-03-orders-and-merchant-operations/stories/story-e03-s01-orders-api-timeline-reservation/README.md) | E03  | Week 5 Day 3-4 |          |
| E06-S05  | [Theme Persistence and Editor UI](../../epics/epic-06-ui-system-and-storefront-builder/stories/story-e06-s05-theme-editor/README.md)                                  | E06  | Week 5 Day 4-5 |
| E03-S02  | [Dashboard order operations and printable invoice](../../epics/epic-03-orders-and-merchant-operations/stories/story-e03-s02-dashboard-order-operations/README.md)     | E03  | Week 5 Day 4-5 |
| E06-S06  | [AI Integration for Page Generation](../../epics/epic-06-ui-system-and-storefront-builder/stories/story-e06-s06-ai-page-generation/README.md)                         | E06  | Week 6 Day 1-2 |
| E03-S03  | [Dashboard home metrics and revenue chart](../../epics/epic-03-orders-and-merchant-operations/stories/story-e03-s03-dashboard-home-metrics/README.md)                 | E03  | Week 6 Day 1-2 |
| E06-S07  | [App Integration and Migration](../../epics/epic-06-ui-system-and-storefront-builder/stories/story-e06-s07-app-integration/README.md)                                 | E06  | Week 6 Day 3-4 |
| E03-S04  | [Customer management and order history](../../epics/epic-03-orders-and-merchant-operations/stories/story-e03-s04-customer-management/README.md)                       | E03  | Week 6 Day 3-4 |
| E03-S05  | [Merchant settings and storefront preferences](../../epics/epic-03-orders-and-merchant-operations/stories/story-e03-s05-merchant-settings/README.md)                  | E03  | Week 6 Day 5   |

## Exit Criteria

- [x] Platform landing page live at main domain with signup CTA.
- [x] Merchants can register and log in to dashboard.
- [x] New merchants complete onboarding wizard to set up their store.
- [x] Orders are manageable from dashboard.
- [x] Inventory updates on order change.
- [x] Dashboard shows operational stats.
- [x] Core dashboard screens are mobile-responsive.
- [x] `@baazarify/storefront-builder` package with sections.
- [x] Theme editor UI for merchants.
- [x] AI-assisted landing page generation working.
- [x] All apps using shared `@baazarify/ui` components.

## Completion Summary

**Status**: ✅ Done (2026-02-06)

All 12 stories across 3 epics completed successfully:

- **E07** (Landing & Auth): 3 stories - Landing page, auth pages (login/register/forgot-password/reset), onboarding wizard
- **E03** (Orders & Merchant Ops): 5 stories - Orders API with statusHistory, dashboard order UI, metrics/revenue chart, customer management, merchant settings, audit logging
- **E06** (UI & Storefront Builder): 4 stories - @baazarify/storefront-builder package (11 sections), theme editor UI, AI page generation (Anthropic SDK), app integration

**Key Implementation Details**:

- Register endpoint refactored: creates user only, store creation moved to /onboarding/complete
- Dashboard uses route groups: (landing), (auth), (onboarding), (dashboard)
- Auth flow: JWT tokens in localStorage, 401 interceptor with refresh, ProtectedRoute component
- Order model: statusHistory[] for timeline tracking
- Store model: settings.theme.tokens (Mixed), landingPage.config/draftConfig
- Storefront builder: sections auto-register via registry, each has Zod schema + defaults
- AI integration: Anthropic SDK, rate limited 10/hr, saves as draft

## Detailed Plan

- [Execution Plan](./execution-plan.md)
