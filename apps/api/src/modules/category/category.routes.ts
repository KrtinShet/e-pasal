import { Router } from 'express';

import { validate } from '../../middleware/validate.js';
import { authenticate, requireStore } from '../../middleware/auth.js';

import {
  categoryController,
  createCategorySchema,
  updateCategorySchema,
  listCategoryQuerySchema,
} from './category.controller.js';

export const categoryRouter = Router();

categoryRouter.use(authenticate, requireStore);

categoryRouter.post('/', validate(createCategorySchema), (req, res, next) =>
  categoryController.create(req, res, next)
);
categoryRouter.get('/', validate(listCategoryQuerySchema, 'query'), (req, res, next) =>
  categoryController.list(req, res, next)
);
categoryRouter.get('/:id', (req, res, next) => categoryController.getById(req, res, next));
categoryRouter.patch('/:id', validate(updateCategorySchema), (req, res, next) =>
  categoryController.update(req, res, next)
);
categoryRouter.delete('/:id', (req, res, next) => categoryController.delete(req, res, next));
