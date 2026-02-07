# Phase 1 MVP Project Management

This folder translates the roadmap into a hierarchical project-management structure with epics, stories, tasks, subtasks, and sprint plans.

## Planning Inputs

- Source roadmap: [docs/system-design/07-roadmap/phase-1-mvp.md](../../system-design/07-roadmap/phase-1-mvp.md)
- Timeline: 10 weeks (5 sprints)
- Goal: onboard first 50 paying merchants with a production-ready MVP.

## Navigation

- [Epic Backlog](./epics/README.md)
- [Sprint Plans](./sprints/README.md)

## Epic Breakdown

| Epic ID | Epic                                                                                           | Planned Sprints    | Stories |
| ------- | ---------------------------------------------------------------------------------------------- | ------------------ | ------- |
| E01     | [Foundation and Tenant Core](./epics/epic-01-foundation-and-tenant-core/README.md)             | Sprint 1           | 4       |
| E02     | [Catalog and Storefront Commerce](./epics/epic-02-catalog-and-storefront-commerce/README.md)   | Sprint 1, Sprint 2 | 7       |
| E03     | [Orders and Merchant Operations](./epics/epic-03-orders-and-merchant-operations/README.md)     | Sprint 3           | 5       |
| E04     | [Payments, Analytics, and Polish](./epics/epic-04-payments-analytics-and-polish/README.md)     | Sprint 4           | 5       |
| E05     | [Launch and Reliability](./epics/epic-05-launch-and-reliability/README.md)                     | Sprint 5           | 5       |
| E06     | [UI System and Storefront Builder](./epics/epic-06-ui-system-and-storefront-builder/README.md) | Sprint 2, Sprint 3 | 7       |
| E07     | [Landing Page and Merchant Auth](./epics/epic-07-landing-and-auth/README.md)                   | Sprint 3           | 3       |
| E08     | [Design System Consolidation](./epics/epic-08-design-system-consolidation/README.md)           | Sprint 3           | 6       |

## Sprint Breakdown

| Sprint ID | Sprint                                                                            | Duration   | Stories |
| --------- | --------------------------------------------------------------------------------- | ---------- | ------- |
| SPR-01    | [Sprint 1 - Foundation](./sprints/sprint-01-foundation/README.md)                 | Weeks 1-2  | 6       |
| SPR-02    | [Sprint 2 - Storefront](./sprints/sprint-02-storefront/README.md)                 | Weeks 3-4  | 8       |
| SPR-03    | [Sprint 3 - Orders and Dashboard](./sprints/sprint-03-orders-dashboard/README.md) | Weeks 5-6  | 9       |
| SPR-04    | [Sprint 4 - Payments and Polish](./sprints/sprint-04-payments-polish/README.md)   | Weeks 7-8  | 5       |
| SPR-05    | [Sprint 5 - Launch Prep](./sprints/sprint-05-launch-prep/README.md)               | Weeks 9-10 | 5       |

## Working Convention

- Each epic has a `README.md` index and nested story folders.
- Each story has a `README.md` overview plus `tasks.md` and `acceptance.md` detail files.
- Each sprint has a `README.md` and `execution-plan.md` for day-wise sequencing.
