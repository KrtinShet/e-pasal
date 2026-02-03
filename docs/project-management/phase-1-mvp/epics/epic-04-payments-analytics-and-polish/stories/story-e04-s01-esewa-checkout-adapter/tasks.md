# E04-S01 Task Breakdown

## Execution Checklist

## T1. Payment adapter design

- [ ] Define gateway adapter interface for initiate/verify/reconcile
- [ ] Implement eSewa adapter with sandbox credentials
- [ ] Map payment statuses to internal order states

## T2. Checkout wiring

- [ ] Add eSewa option to checkout flow
- [ ] Create pending payment transaction before redirect
- [ ] Handle return URL and failed transaction states

## T3. Security controls

- [ ] Sign outgoing request payloads where required
- [ ] Validate provider response fields and integrity checks
- [ ] Log payment attempts with correlation ids
