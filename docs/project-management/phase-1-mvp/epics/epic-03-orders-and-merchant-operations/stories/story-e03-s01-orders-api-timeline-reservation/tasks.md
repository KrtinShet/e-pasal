# E03-S01 Task Breakdown

## Execution Checklist

## T1. Order model and persistence

- [ ] Create order schema with item snapshot and status history fields
- [ ] Store customer and shipping snapshots for auditability
- [ ] Index by tenant, status, and created date

## T2. Order API behavior

- [ ] Implement list/detail/create/update order endpoints
- [ ] Support filtering by status/date/customer
- [ ] Enforce valid status transition guardrails

## T3. Inventory reservation logic

- [ ] Reserve stock on order creation
- [ ] Release stock on cancellation/failure states
- [ ] Add concurrency tests around reservation updates
