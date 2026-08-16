import { Router } from 'express';
import { createAttempt, getAttempts } from '../controllers/attempt.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createAttemptSchema, queryAttemptSchema } from '../validators/attempt.schema.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, validate(createAttemptSchema), createAttempt);
router.get('/', authenticate, validate(queryAttemptSchema), getAttempts);

export default router;
