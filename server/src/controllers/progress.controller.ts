import { Request, Response, NextFunction } from 'express';
import { progressService } from '../services/progress.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const updateProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await progressService.updateProgress(req.body, req.user!);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    return next(error);
  }
};

export const getProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, studentId, lessonId } = req.query as any;
    const result = await progressService.getProgress(
      { page, limit },
      { studentId, lessonId },
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
