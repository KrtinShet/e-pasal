# E04-S02 Task Breakdown

## Execution Checklist

## T1. Webhook ingestion

- [ ] Implement /webhooks/payment/esewa endpoint
- [ ] Verify callback signature/hash and basic schema
- [ ] Reject stale or replayed callback attempts

## T2. Reconciliation logic

- [ ] Update payment transaction status based on webhook event
- [ ] Update linked order state on confirmed settlement
- [ ] Ensure idempotency for duplicate callback deliveries

## T3. Failure visibility

- [ ] Emit structured logs for webhook outcomes
- [ ] Create retry path for transient processing failures
- [ ] Add alert trigger for repeated webhook errors
