# E01-S03 Task Breakdown

## Execution Checklist

## T1. Store onboarding flow

- [x] Create stores schema with merchant owner relationship
- [x] Implement store create/read endpoints for merchant onboarding
- [x] Generate default store settings on creation

## T2. Tenant resolution middleware

- [x] Resolve tenant by subdomain in host header
- [x] Attach tenant context to request lifecycle
- [x] Handle unknown or disabled tenant failures cleanly

## T3. Isolation tests

- [x] Block duplicate subdomain registration
- [x] Add tests proving tenant data isolation for store-scoped routes
- [x] Document tenant resolution behavior for local development
