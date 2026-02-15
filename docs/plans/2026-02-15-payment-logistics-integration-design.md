# Payment Providers & Logistics Partners Integration Design

**Date**: 2026-02-15
**Status**: Approved
**Reference**: Blanxer ("Commerce OS for Nepal") integration patterns

## Decisions

| Decision            | Choice                                                         |
| ------------------- | -------------------------------------------------------------- |
| Payment approach    | eSewa + Khalti direct + Fonepay QR                             |
| Logistics providers | Pathao + NCM + Dash                                            |
| Architecture        | Provider Adapter Pattern (extend existing interface + factory) |
| Merchant config     | Per-store dashboard settings with encrypted credentials        |
| COD                 | First-class with logistics-managed cash collection             |

## 1. Payment Integration

### 1.1 Provider Implementations

**eSewa (ePay V2)**

- Flow: Server generates HMAC-SHA256 signature -> form POST to eSewa -> user pays -> redirect back with Base64 response -> server verifies signature + calls Status API
- Signature: `HMAC-SHA256(total_amount,transaction_uuid,product_code, secret_key)` -> Base64
- Endpoints: `https://epay.esewa.com.np/api/epay/main/v2/form` (payment), `esewa.com.np/api/epay/transaction/status/` (verify)
- Sandbox: `rc-epay.esewa.com.np`, test IDs 9806800001-5, Password Nepal@123, OTP 123456

**Khalti (ePayment v2)**

- Flow: Server POST `/epayment/initiate/` -> get pidx + payment_url -> redirect user -> return with status -> POST `/epayment/lookup/` to confirm
- Auth: `Authorization: Key <SECRET_KEY>` header
- Amount in paisa (multiply by 100), minimum 1000 paisa
- Sandbox: `dev.khalti.com`, test IDs 9800000000-5, MPIN 1111, OTP 987654

**Fonepay (QR)**

- Flow: Server generates merchant request -> redirect to Fonepay -> QR displayed -> user scans with any banking app -> callback
- Coverage: 64+ connected BFIs (eSewa, Khalti, IME Pay, all banking apps)
- Endpoint: `https://clientapi.fonepay.com/api/merchantRequest`

### 1.2 Extended PaymentProvider Interface

Add to existing `payment.interface.ts`:

```typescript
interface PaymentProvider {
  readonly name: string;
  initiate(params: PaymentInitiateParams): Promise<PaymentInitiateResult>;
  verify(transactionId: string): Promise<PaymentVerifyResult>;
  refund(transactionId: string, amount?: number): Promise<PaymentRefundResult>;
  handleWebhook(payload: unknown, signature?: string): Promise<WebhookResult>; // NEW
}

interface WebhookResult {
  verified: boolean;
  orderId: string;
  transactionId: string;
  status: 'paid' | 'failed' | 'refunded';
  amount: number;
}
```

### 1.3 PaymentTransaction Model

New model for idempotent payment tracking:

```
PaymentTransaction {
  storeId, orderId, provider, method,
  transactionId (provider reference),
  idempotencyKey (orderId + provider + attempt),
  amount, currency ('NPR'),
  status: pending | initiated | completed | failed | refunded,
  providerResponse (raw response for debugging),
  initiatedAt, completedAt, failedAt, refundedAt,
  statusHistory: [{ status, timestamp, raw }]
}
```

### 1.4 Payment Flow Integration

1. Customer selects payment method at checkout (storefront)
2. POST `/v1/integrations/payment/initiate` -> create PaymentTransaction -> call provider -> return redirect URL
3. User pays on provider page
4. Provider redirects to callback URL -> verify with provider -> update PaymentTransaction -> update Order.paymentStatus
5. Webhook (async): verify signature -> idempotent status update -> trigger order transition (pending -> confirmed)
6. COD: auto-confirm order, payment tracked via logistics COD collection field

## 2. Logistics Integration

### 2.1 LogisticsProvider Interface

New interface at `modules/integration/logistics/logistics.interface.ts`:

```typescript
interface LogisticsProvider {
  readonly name: string;
  getServiceAreas(): Promise<ServiceArea[]>;
  calculateRate(params: RateParams): Promise<RateResult>;
  createShipment(params: ShipmentParams): Promise<ShipmentResult>;
  getTracking(trackingId: string): Promise<TrackingResult>;
  cancelShipment(trackingId: string): Promise<CancelResult>;
  handleWebhook(payload: unknown): Promise<LogisticsWebhookResult>;
}

interface RateParams {
  pickupCity: string;
  pickupZone?: string;
  deliveryCity: string;
  deliveryZone?: string;
  weight: number; // kg
  itemType: 'document' | 'parcel';
  codAmount?: number;
}

interface ShipmentParams {
  orderId: string;
  pickupStore: { name; address; city; zone?; area?; phone };
  recipient: { name; phone; address; city; zone?; area? };
  package: { weight; itemType; description; quantity };
  codAmount?: number;
  deliveryType?: 'normal' | 'express';
  specialInstructions?: string;
}

interface ShipmentResult {
  success: boolean;
  consignmentId: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  cost?: number;
}
```

### 2.2 Provider Implementations

**Pathao** (full implementation)

- OAuth auth: client_id, client_secret, username, password -> access_token
- Location hierarchy: City -> Zone -> Area (fetch and cache in Redis)
- Shipment: POST with store_id, recipient, delivery_type (48=normal, 12=on-demand), item_type, amount_to_collect
- Tracking by consignment_id
- Webhooks for delivery status
- Sandbox available

**NCM** (scaffold, implement when API docs obtained)

- Contact: support@nepalcanmove.com for merchant API access
- Key: fast COD settlement (24h)
- Adapter scaffolded with NotImplementedError

**Dash** (scaffold, implement when API docs obtained)

- Contact: dashlogistics.com.np for API access
- Features: half-kg pricing, warehousing, cross-border
- Adapter scaffolded with NotImplementedError

### 2.3 Shipment Model

```
Shipment {
  storeId, orderId (ref Order),
  provider: 'pathao' | 'ncm' | 'dash',
  consignmentId, trackingNumber, trackingUrl,
  status: pending | picked_up | in_transit | out_for_delivery | delivered | returned | cancelled,
  pickup: { address, city, zone?, area?, contactPhone, scheduledAt? },
  delivery: { recipientName, phone, address, city, zone?, area? },
  package: { weight, itemType, description, quantity },
  cod: { amount, collected: boolean, settledAt? },
  statusHistory: [{ status, timestamp, note, raw? }],
  estimatedDelivery?, actualDelivery?,
  cost, providerResponse,
  createdAt, updatedAt
}
```

### 2.4 Order <-> Shipment Flow

1. Merchant confirms order -> dashboard shows "Ship Order" button
2. Merchant selects logistics provider -> system calls calculateRate()
3. Merchant confirms -> createShipment() -> Shipment created, order.status -> shipped
4. Logistics webhooks update Shipment.status -> on delivered, order.status -> delivered
5. COD: logistics provider collects cash -> webhook marks cod.collected -> reconcile with Order.paymentStatus

## 3. Merchant Dashboard Configuration

### 3.1 Integration Settings Page

Dashboard route: `/settings/integrations`

**Payments Tab**

- Toggle cards for eSewa, Khalti, Fonepay
- Each: enable/disable toggle, API credential inputs, test mode toggle
- "Test Connection" button to verify credentials
- COD always available (no config needed)

**Logistics Tab**

- Toggle cards for Pathao, NCM, Dash
- Each: enable/disable, API credentials, default pickup address
- Rate preview: test shipping cost for sample address

### 3.2 Store Model Changes

Expand `store.integrations` from string arrays to structured config:

```typescript
integrations: {
  payments: [{
    provider: 'esewa' | 'khalti' | 'fonepay',
    enabled: boolean,
    testMode: boolean,
    credentials: {  // encrypted at rest with AES-256
      merchantCode?: string,
      secretKey?: string,
      publicKey?: string,
    },
    connectedAt?: Date
  }],
  logistics: [{
    provider: 'pathao' | 'ncm' | 'dash',
    enabled: boolean,
    credentials: { /* provider-specific, encrypted */ },
    defaultPickupAddress?: { address, city, zone, area, phone },
    connectedAt?: Date
  }]
}
```

### 3.3 Credential Security

- API keys encrypted at rest using AES-256 (INTEGRATION_ENCRYPTION_KEY env var)
- Keys masked in API responses (\*\*\*\*abcd)
- Decrypted only server-side when making provider API calls

### 3.4 Storefront Checkout

- Checkout queries store's enabled payment methods via API
- Only shows configured + enabled options
- eSewa/Khalti: redirect flow. Fonepay: QR display. COD: direct confirmation

## 4. Module Structure

```
modules/integration/
  payment/
    payment.interface.ts        (extend with handleWebhook)
    payment.factory.ts          (extend with fonepay)
    payment.controller.ts       (implement TODOs)
    payment.routes.ts           (exists)
    payment-transaction.model.ts (new)
    providers/
      esewa.provider.ts         (implement)
      khalti.provider.ts        (implement)
      fonepay.provider.ts       (new)
  logistics/
    logistics.interface.ts      (new)
    logistics.factory.ts        (new)
    logistics.controller.ts     (new)
    logistics.routes.ts         (new)
    shipment.model.ts           (new)
    providers/
      pathao.provider.ts        (new - full implementation)
      ncm.provider.ts           (new - scaffold)
      dash.provider.ts          (new - scaffold)
  webhook/
    webhook.controller.ts       (unified webhook endpoint)
    webhook.routes.ts           (new)
  integration-settings/
    settings.controller.ts      (new - CRUD for store integration config)
    settings.routes.ts          (new)
    encryption.util.ts          (new - AES-256 encrypt/decrypt)
```

## 5. Environment Variables (New)

```
# Payment providers
ESEWA_MERCHANT_CODE=        (platform default, overridable per store)
ESEWA_SECRET_KEY=
KHALTI_SECRET_KEY=
KHALTI_PUBLIC_KEY=
FONEPAY_MERCHANT_CODE=
FONEPAY_SECRET_KEY=

# Logistics providers
PATHAO_CLIENT_ID=
PATHAO_CLIENT_SECRET=
PATHAO_USERNAME=
PATHAO_PASSWORD=

# Security
INTEGRATION_ENCRYPTION_KEY=  (AES-256 key for credential encryption)

# Webhook base URL
WEBHOOK_BASE_URL=https://api.baazarify.com
```

## 6. Implementation Priority

1. **Phase 1 - Payment Foundation**: PaymentTransaction model, eSewa provider implementation, Khalti provider implementation, callback/verify flow, order integration
2. **Phase 2 - Logistics Foundation**: LogisticsProvider interface, Shipment model, Pathao provider (full), NCM/Dash scaffolds, shipment creation flow
3. **Phase 3 - Fonepay + Webhooks**: Fonepay QR provider, webhook verification for all providers, idempotent processing
4. **Phase 4 - Dashboard Config**: Integration settings API, dashboard settings UI, credential encryption, storefront checkout updates
5. **Phase 5 - COD Reconciliation**: COD tracking through logistics, cash collection webhooks, payment reconciliation
