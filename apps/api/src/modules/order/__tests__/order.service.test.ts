/**
 * Order Service Test Suite
 *
 * This file serves as the main entry point for all order service tests.
 * Tests are organized into separate modules for better maintainability:
 *
 * - create.test.ts: Order creation and validation tests
 * - retrieval.test.ts: Order retrieval (getById, getByOrderNumber) tests
 * - list.test.ts: Order listing, filtering, and pagination tests
 * - status-updates.test.ts: Order status transition tests
 * - payment-fulfillment.test.ts: Payment status, fulfillment, and notes tests
 */

import './order-service/create.test.js';
import './order-service/retrieval.test.js';
import './order-service/list.test.js';
import './order-service/status-updates.test.js';
import './order-service/payment-fulfillment.test.js';
