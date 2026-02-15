# E09-S02 Task Breakdown

## Execution Checklist

## T1. Pathao OAuth

- [ ] Implement token management with client_id, client_secret, username, password
- [ ] Auto-refresh expired tokens
- [ ] Store access tokens in Redis with TTL

## T2. Location data

- [ ] Fetch City -> Zone -> Area hierarchy from Pathao API
- [ ] Cache in Redis with 24h TTL
- [ ] Expose via API endpoint for address selection in dashboard/storefront

## T3. Shipment creation

- [ ] Implement createShipment() - POST to Pathao API
- [ ] Include store_id, merchant_order_id, recipient details
- [ ] Support delivery_type (48=normal, 12=on-demand)
- [ ] Support item_type (1=document, 2=parcel)
- [ ] Handle amount_to_collect for COD orders

## T4. Tracking

- [ ] Implement getTracking() by consignment_id
- [ ] Map Pathao delivery statuses to internal Shipment statuses
- [ ] Return tracking URL for customer-facing display

## T5. Webhooks

- [ ] Configure webhook URL in Pathao developer portal
- [ ] Implement webhook handler for delivery status updates
- [ ] Update Shipment status and Order status on webhook events
- [ ] Handle COD collection notifications

## T6. Rate calculation

- [ ] Implement calculateRate() using Pathao pricing API
- [ ] Show estimated shipping cost before shipment creation
- [ ] Factor in weight, delivery type, and COD amount
