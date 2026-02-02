import { Router } from 'express';
import { storefrontController } from './storefront.controller.js';

export const storefrontRouter = Router();

storefrontRouter.get('/:subdomain', (req, res, next) => storefrontController.getStore(req, res, next));
storefrontRouter.get('/:subdomain/products', (req, res, next) => storefrontController.listProducts(req, res, next));
storefrontRouter.get('/:subdomain/products/:slug', (req, res, next) => storefrontController.getProduct(req, res, next));
storefrontRouter.get('/:subdomain/categories', (req, res, next) => storefrontController.listCategories(req, res, next));
storefrontRouter.post('/:subdomain/checkout', (req, res, next) => storefrontController.checkout(req, res, next));
storefrontRouter.get('/:subdomain/orders/:orderNumber', (req, res, next) => storefrontController.trackOrder(req, res, next));
