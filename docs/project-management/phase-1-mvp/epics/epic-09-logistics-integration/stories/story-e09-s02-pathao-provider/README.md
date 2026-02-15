# E09-S02 - Pathao provider implementation

## Overview

- Epic: [E09 - Logistics Integration](../../README.md)
- Sprint: Sprint 6
- Planned window: Week 9 Day 2-4
- Status: Pending

## Goal

Implement full Pathao logistics provider with OAuth, location caching, shipment creation, tracking, webhooks, and rate calculation.

## Deliverables

- PathaoProvider class implementing LogisticsProvider
- OAuth token management with Redis caching
- City/Zone/Area location hierarchy caching
- Shipment CRUD, tracking, and webhook handling
- Rate calculation

## Dependencies

- [E09-S01](../story-e09-s01-logistics-interface-shipment-model/README.md) (interface and model)

## Technical Design

- [Payment & Logistics Integration Design](../../../../../../plans/2026-02-15-payment-logistics-integration-design.md)

## Detail Files

- [Task Breakdown](./tasks.md)
- [Acceptance Criteria](./acceptance.md)
