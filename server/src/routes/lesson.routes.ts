import { Router } from 'express';
import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lesson.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createLessonSchema,
  updateLessonSchema,
  queryLessonSchema,
} from '../validators/lesson.schema.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';

const router = Router();

router.get(
  '/',
  optionalAuthenticate,
  validate(queryLessonSchema),
  getLessons
);

router.get(
  '/:id',
  optionalAuthenticate,
  getLessonById
);

router.post(
  '/',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  validate(createLessonSchema),
  createLesson
);

router.patch(
  '/:id',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  validate(updateLessonSchema),
  updateLesson
);

router.delete(
  '/:id',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  deleteLesson
);

export default router;
