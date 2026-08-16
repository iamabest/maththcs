import { Router } from 'express';
import { updateProgress, getProgress } from '../controllers/progress.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProgressSchema, queryProgressSchema } from '../validators/progress.schema.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, validate(updateProgressSchema), updateProgress);
router.get('/', authenticate, validate(queryProgressSchema), getProgress);

export default router;
