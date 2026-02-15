# E04-S07 Task Breakdown

## Execution Checklist

## T1. Fonepay provider implementation

- [x] Implement FonepayProvider class with merchant request generation
- [x] QR checkout flow via clientapi.fonepay.com/api/merchantRequest endpoint
- [x] Callback verification with signature validation
- [x] Register FonepayProvider in payment factory

## T2. QR checkout UX

- [ ] Storefront displays Fonepay QR code for scanning
- [ ] Poll for payment status while QR is displayed
- [ ] Handle success and failure states with appropriate UI feedback
- [ ] Timeout handling for expired QR sessions

## T3. Callback handling

- [x] Verify Fonepay callback signature
- [ ] Update PaymentTransaction status on callback
- [ ] Update Order.paymentStatus on confirmed payment
- [x] Handle edge cases (expired, cancelled, failed)
