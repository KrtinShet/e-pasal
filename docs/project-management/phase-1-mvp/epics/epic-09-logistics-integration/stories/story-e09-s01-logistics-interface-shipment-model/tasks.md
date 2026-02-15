# E09-S01 Task Breakdown

## Execution Checklist

## T1. LogisticsProvider interface

- [ ] Define LogisticsProvider interface with methods: getServiceAreas(), calculateRate(params), createShipment(params), getTracking(trackingId), cancelShipment(trackingId), handleWebhook(payload)
- [ ] Define RateParams type (pickupCity, pickupZone, deliveryCity, deliveryZone, weight, itemType, codAmount)
- [ ] Define ShipmentParams type (orderId, pickupStore, recipient, package, codAmount, deliveryType, specialInstructions)
- [ ] Define ShipmentResult type (success, consignmentId, trackingNumber, trackingUrl, estimatedDelivery, cost)
- [ ] Define TrackingResult type with status mapping

## T2. Shipment model

- [ ] Create Mongoose model with storeId, orderId (ref Order), provider (pathao|ncm|dash)
- [ ] Fields: consignmentId, trackingNumber, trackingUrl
- [ ] Status enum: pending, picked_up, in_transit, out_for_delivery, delivered, returned, cancelled
- [ ] Pickup details: address, city, zone, area, contactPhone, scheduledAt
- [ ] Delivery details: recipientName, phone, address, city, zone, area
- [ ] Package info: weight, itemType, description, quantity
- [ ] COD fields: amount, collected (boolean), settledAt
- [ ] StatusHistory array: status, timestamp, note, raw
- [ ] Fields: estimatedDelivery, actualDelivery, cost, providerResponse
- [ ] Indexes: storeId+orderId, storeId+status, storeId+provider

## T3. Logistics factory

- [ ] Implement factory pattern matching payment factory
- [ ] getLogisticsProvider(name) returns correct provider instance
- [ ] getSupportedProviders() returns list of registered providers

## T4. Logistics controller and routes

- [ ] CRUD endpoints for shipments
- [ ] Rate calculation endpoint (POST /v1/logistics/rates)
- [ ] Tracking endpoint (GET /v1/logistics/tracking/:trackingId)
- [ ] Webhook endpoint per provider (POST /v1/logistics/webhooks/:provider)
- [ ] Register routes in main router
