# E02-S07 Task Breakdown

## Execution Checklist

## T1. Checkout UX

- [ ] Build checkout form for customer, contact, and shipping fields
- [ ] Implement address and input validation
- [ ] Display order summary with totals before submission

## T2. Order creation integration

- [ ] Submit checkout data to storefront order endpoint
- [ ] Persist COD payment mode and initial order status
- [ ] Handle API failures and safe retry patterns

## T3. Post-purchase flow

- [ ] Render order confirmation page with reference details
- [ ] Expose next steps to customer after COD order
- [ ] Emit order-created event for notifications/analytics
