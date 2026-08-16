import { Request, Response, NextFunction } from 'express';
import { attemptService } from '../services/attempt.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const createAttempt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attempt = await attemptService.createAttempt(req.body, req.user!);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAttempts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, studentId, quizId, lessonId } = req.query as any;
    const result = await attemptService.getAttempts(
      { page, limit },
      { studentId, quizId, lessonId },
      req.user
    );
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};
