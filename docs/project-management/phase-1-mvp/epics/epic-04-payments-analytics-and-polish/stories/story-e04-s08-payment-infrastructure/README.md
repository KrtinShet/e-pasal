# E04-S08 - Payment infrastructure and merchant config

## Overview

- Epic: [E04 - Payments, Analytics, and Polish](../../README.md)
- Sprint: Sprint 4
- Planned window: Week 8 Day 3-5
- Status: Pending

## Goal

Build PaymentTransaction model, credential encryption, integration settings API and dashboard UI, storefront checkout updates, and order-payment wiring.

## Deliverables

- PaymentTransaction Mongoose model
- AES-256 credential encryption utility
- Integration settings CRUD API
- Dashboard /settings/integrations page (Payments and Logistics tabs)
- Storefront checkout showing only enabled payment methods
- Order-payment lifecycle wiring

## Dependencies

- [E04-S01](../story-e04-s01-esewa-checkout-adapter/README.md) (payment adapter)
- [E04-S02](../story-e04-s02-esewa-webhook-reconciliation/README.md) (webhook flow)
- [E04-S06](../story-e04-s06-khalti-payment-provider/README.md) (Khalti provider)
- [E04-S07](../story-e04-s07-fonepay-qr-provider/README.md) (Fonepay provider)

## Technical Design

- [Payment Integration Design](../../../../../plans/2026-02-15-payment-logistics-integration-design.md)

## Detail Files

- [Task Breakdown](./tasks.md)
- [Acceptance Criteria](./acceptance.md)
