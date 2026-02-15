import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.routes.js';
import { betaRouter } from '../modules/beta/beta.routes.js';
import { storeRouter } from '../modules/store/store.routes.js';
import { orderRouter } from '../modules/order/order.routes.js';
import { uploadRouter } from '../modules/upload/upload.routes.js';
import { productRouter } from '../modules/product/product.routes.js';
import { categoryRouter } from '../modules/category/category.routes.js';
import { customerRouter } from '../modules/customer/customer.routes.js';
import { inventoryRouter } from '../modules/inventory/inventory.routes.js';
import { analyticsRouter } from '../modules/analytics/analytics.routes.js';
import { onboardingRouter } from '../modules/onboarding/onboarding.routes.js';
import { storefrontRouter } from '../modules/storefront/storefront.routes.js';
import { paymentRouter } from '../modules/integration/payment/payment.routes.js';
import { notificationRouter } from '../modules/notification/notification.routes.js';
import { logisticsRouter } from '../modules/integration/logistics/logistics.routes.js';
import { integrationSettingsRouter } from '../modules/integration/integration-settings/settings.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/beta', betaRouter);
router.use('/stores', storeRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/orders', orderRouter);
router.use('/customers', customerRouter);
router.use('/inventory', inventoryRouter);
router.use('/storefront', storefrontRouter);
router.use('/notifications', notificationRouter);
router.use('/analytics', analyticsRouter);
router.use('/upload', uploadRouter);
router.use('/onboarding', onboardingRouter);
router.use('/integrations/payment', paymentRouter);
router.use('/integrations/logistics', logisticsRouter);
router.use('/integrations/settings', integrationSettingsRouter);
