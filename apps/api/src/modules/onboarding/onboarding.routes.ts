import { Router } from 'express';

import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';

import { onboardingController, completeOnboardingSchema } from './onboarding.controller.js';

export const onboardingRouter = Router();

onboardingRouter.use(authenticate);

onboardingRouter.post('/complete', validate(completeOnboardingSchema), (req, res, next) =>
  onboardingController.complete(req, res, next)
);
