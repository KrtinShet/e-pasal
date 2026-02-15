# E09-S04 Task Breakdown

## Execution Checklist

## T1. Logistics settings UI

- [ ] Add Logistics tab to /settings/integrations page
- [ ] Toggle cards for Pathao, NCM, Dash
- [ ] Each card: credential inputs and default pickup address configuration
- [ ] Enable/disable toggle per provider

## T2. Ship order flow

- [ ] Add "Ship Order" button to order detail page in dashboard
- [ ] Provider selection dropdown (only show enabled providers)
- [ ] Show shipping rate estimate before confirmation
- [ ] Confirm and create shipment via API
- [ ] Update order status to shipped on success

## T3. Shipment tracking UI

- [ ] Show tracking info on order detail page
- [ ] Display: consignment ID, tracking number, tracking URL link
- [ ] Status timeline visualization
- [ ] Update tracking via polling or webhook

## T4. Shipment list

- [ ] Dashboard page listing all shipments
- [ ] Filters: status, provider, date range
- [ ] Link each shipment to its order
- [ ] Pagination support
