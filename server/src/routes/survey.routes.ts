import { Router } from 'express';
import { submitSurvey, getSurveys } from '../controllers/survey.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createSurveySchema, querySurveySchema } from '../validators/survey.schema.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, validate(createSurveySchema), submitSurvey);
router.get('/', authenticate, validate(querySurveySchema), getSurveys);

export default router;
