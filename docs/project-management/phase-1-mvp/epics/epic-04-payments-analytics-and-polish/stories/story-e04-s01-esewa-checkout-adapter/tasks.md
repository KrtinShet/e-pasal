# E04-S01 Task Breakdown

## Execution Checklist

## T1. Payment adapter design

- [x] Define gateway adapter interface for initiate/verify/reconcile
- [x] Implement eSewa adapter with sandbox credentials
- [x] Map payment statuses to internal order states

## T2. Checkout wiring

- [x] Add eSewa option to checkout flow
- [x] Create pending payment transaction before redirect
- [x] Handle return URL and failed transaction states

## T3. Security controls

- [x] Sign outgoing request payloads where required
- [x] Validate provider response fields and integrity checks
- [x] Log payment attempts with correlation ids
