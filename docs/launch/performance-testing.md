# Performance Testing Plan

## Targets

| Metric                | Target  | Critical |
| --------------------- | ------- | -------- |
| API p95 response time | < 200ms | < 500ms  |
| Storefront TTFB       | < 300ms | < 800ms  |
| Dashboard page load   | < 2s    | < 4s     |
| Concurrent users      | 100+    | 50+      |
| Database query time   | < 50ms  | < 200ms  |

## Test Scenarios

### 1. API Load Testing

```bash
# Use k6, autocannon, or similar tool
# Target: /api/v1/products (authenticated, scoped by storeId)
# Ramp: 10 → 50 → 100 concurrent users over 5 minutes
```

Key endpoints to test:

- `GET /api/v1/products` — product listing with pagination
- `GET /api/v1/orders` — order listing with filters
- `POST /api/v1/orders` — order creation under load
- `GET /api/v1/analytics/metrics` — dashboard metrics aggregation

### 2. Database Performance

- Verify all queries use indexes (especially storeId-first compound indexes)
- Check `explain()` output for common queries
- Test with realistic data volumes (1000+ products, 5000+ orders per store)

### 3. Storefront Rendering

- Lighthouse audit on storefront pages (target: 90+ performance score)
- Test with multiple concurrent tenant storefronts
- Verify Next.js ISR/SSR performance under load

### 4. Payment Flow

- Test payment initiation → callback → verification flow end-to-end
- Verify timeout handling for slow payment provider responses
- Test concurrent payment processing

## Pre-Launch Checks

- [ ] Run load test against staging environment
- [ ] Verify MongoDB indexes cover all frequent queries
- [ ] Check Redis cache hit rates
- [ ] Confirm no N+1 query patterns in order/product listing
- [ ] Verify Docker container memory limits are set appropriately
