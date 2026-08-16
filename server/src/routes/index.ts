import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import lessonRoutes from './lesson.routes.js';
import healthRoutes from './health.routes.js';
import attemptRoutes from './attempt.routes.js';
import progressRoutes from './progress.routes.js';
import surveyRoutes from './survey.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/lessons', lessonRoutes);
apiRouter.use('/attempts', attemptRoutes);
apiRouter.use('/progress', progressRoutes);
apiRouter.use('/surveys', surveyRoutes);
apiRouter.use('/health', healthRoutes);

export default apiRouter;
