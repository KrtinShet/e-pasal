# E01-S03 Task Breakdown

## Execution Checklist

## T1. Store onboarding flow

- [ ] Create stores schema with merchant owner relationship
- [ ] Implement store create/read endpoints for merchant onboarding
- [ ] Generate default store settings on creation

## T2. Tenant resolution middleware

- [ ] Resolve tenant by subdomain in host header
- [ ] Attach tenant context to request lifecycle
- [ ] Handle unknown or disabled tenant failures cleanly

## T3. Isolation tests

- [ ] Block duplicate subdomain registration
- [ ] Add tests proving tenant data isolation for store-scoped routes
- [ ] Document tenant resolution behavior for local development
