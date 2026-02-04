# E07-S03 - Merchant Onboarding Flow

## Overview

- Epic: [E07 - Landing Page and Merchant Auth](../../README.md)
- Sprint: Sprint 3
- Planned window: Week 5 Day 2-3
- Status: Pending

## Goal

Build a guided onboarding wizard for new merchants after registration. Users set up their store (name, subdomain, basic settings) and are then directed to the dashboard. The onboarding flow ensures every merchant has a properly configured store before accessing the main dashboard.

## User Journey

1. User registers on `/register` (E07-S02)
2. User is redirected to `/onboarding`
3. User completes onboarding steps:
   - Step 1: Store basics (name, subdomain)
   - Step 2: Business info (contact, address - optional)
   - Step 3: Store appearance (logo upload, theme colors - optional)
4. User clicks "Launch Store" → Store is created
5. User is redirected to `/dashboard` with their new store

## Deliverables

- Onboarding page with multi-step wizard UI
- Store setup form (name, subdomain with availability check)
- Optional business info collection
- Optional appearance customization (logo, colors)
- API integration to create store
- Progress indicator showing current step
- Skip functionality for optional steps
- Onboarding completion tracking (user flag or store existence)

## Dependencies

- E07-S02 (Auth Pages - user must be authenticated)
- E01-S03 (Store API - for store creation)

## Detail Files

- [Task Breakdown](./tasks.md)
- [Acceptance Criteria](./acceptance.md)
