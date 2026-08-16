import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createUserSchema,
  updateUserSchema,
  queryUserSchema,
} from '../validators/user.schema.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(queryUserSchema),
  getUsers
);

router.get(
  '/:id',
  authenticate,
  getUserById
);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createUserSchema),
  createUser
);

router.patch(
  '/:id',
  authenticate,
  validate(updateUserSchema),
  updateUser
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  deleteUser
);

export default router;
