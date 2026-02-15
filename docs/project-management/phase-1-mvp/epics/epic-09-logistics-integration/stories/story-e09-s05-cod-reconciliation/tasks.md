# E09-S05 Task Breakdown

## Execution Checklist

## T1. COD tracking

- [ ] When order is COD + shipped via logistics partner, track cod.amount on Shipment
- [ ] Set cod.collected=false initially
- [ ] Link COD status to Order.paymentStatus

## T2. COD collection webhook

- [ ] When logistics provider webhook indicates delivery + cash collected, update cod.collected=true
- [ ] Set Order.paymentStatus to 'paid'
- [ ] Record settledAt timestamp on Shipment.cod
- [ ] Handle idempotent webhook processing

## T3. COD settlement dashboard

- [ ] Show COD collection status on order detail page
- [ ] Dashboard widget showing pending COD amounts by provider
- [ ] Display settled vs pending totals
- [ ] Filter by date range and provider

## T4. Manual COD reconciliation

- [ ] For providers without webhook support (NCM/Dash initially), allow manual marking
- [ ] Merchants can mark COD as collected from logistics provider
- [ ] Record who marked it and when (audit trail)
- [ ] Update Order.paymentStatus on manual reconciliation
