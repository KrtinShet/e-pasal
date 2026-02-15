# E04-S08 Task Breakdown

## Execution Checklist

## T1. PaymentTransaction model

- [ ] Create Mongoose model with storeId, orderId, provider, transactionId, idempotencyKey
- [ ] Fields: amount, currency (NPR), status (pending/initiated/completed/failed/refunded)
- [ ] Fields: providerResponse, statusHistory (array of {status, timestamp, raw})
- [ ] Add timestamps (createdAt, updatedAt)
- [ ] Create indexes on storeId+orderId, storeId+provider, idempotencyKey (unique)

## T2. Credential encryption

- [ ] Implement AES-256 encryption utility for API keys at rest
- [ ] Use INTEGRATION_ENCRYPTION_KEY env var for encryption key
- [ ] Mask keys in API responses (show only last 4 chars: \*\*\*\*abcd)
- [ ] Decrypt only server-side when making provider API calls

## T3. Integration settings API

- [ ] CRUD endpoints for store payment/logistics configuration
- [ ] Expand store.integrations from string arrays to structured objects
- [ ] Structured format: provider, enabled, testMode, credentials (encrypted), connectedAt
- [ ] Validate provider names and credential fields per provider type

## T4. Dashboard integration settings UI

- [ ] Create /settings/integrations page in dashboard
- [ ] Payments tab: toggle cards for eSewa, Khalti, Fonepay
- [ ] Each payment card: credential inputs, test mode toggle, test connection button
- [ ] Logistics tab: toggle cards for Pathao, NCM, Dash
- [ ] Each logistics card: credential inputs, default pickup address

## T5. Storefront checkout update

- [ ] Query store's enabled payment methods via API
- [ ] Only show configured and enabled payment options at checkout
- [ ] Route to correct provider flow (eSewa/Khalti redirect, Fonepay QR, COD direct)

## T6. Order-payment wiring

- [ ] Connect payment controller TODOs for callback handling
- [ ] On callback: update PaymentTransaction + Order.paymentStatus
- [ ] Trigger order status transition (pending -> confirmed) on successful payment
- [ ] Handle failed payment callbacks gracefully
