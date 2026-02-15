# E04-S06 Task Breakdown

## Execution Checklist

## T1. Khalti provider implementation

- [x] Implement KhaltiProvider class with initiate method (POST /epayment/initiate/, amount in paisa)
- [x] Implement verify method (POST /epayment/lookup/ with pidx)
- [x] Implement refund method
- [x] Auth via `Authorization: Key <SECRET_KEY>` header
- [x] Configure sandbox endpoint at dev.khalti.com

## T2. Checkout integration

- [x] Add Khalti option to storefront checkout payment selection
- [x] Handle redirect flow (payment_url from initiate response)
- [x] Process return params (pidx, status, transaction_id)
- [ ] Create PaymentTransaction record before redirect

## T3. Webhook handling

- [x] Implement Khalti webhook verification
- [ ] Idempotent status updates using PaymentTransaction idempotencyKey
- [x] Map Khalti statuses (Completed/Pending/Refunded/Expired) to internal statuses
- [ ] Update Order.paymentStatus on webhook confirmation

## T4. Testing

- [ ] Sandbox end-to-end test with credentials 9800000000-5, MPIN 1111, OTP 987654
- [ ] Verify payment initiation, redirect, and callback flow
- [ ] Test refund flow in sandbox
- [ ] Test webhook idempotency (duplicate webhook handling)
