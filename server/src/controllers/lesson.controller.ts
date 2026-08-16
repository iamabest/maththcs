import { Request, Response, NextFunction } from 'express';
import { lessonService } from '../services/lesson.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const getLessons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, grade, status, search, teacherId } = req.query as any;
    const result = await lessonService.getLessons(
      { page, limit },
      { grade, status, search, teacherId },
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

export const getLessonById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id, req.user);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    return next(error);
  }
};

export const createLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lesson = await lessonService.createLesson(req.body, req.user!);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lesson = await lessonService.updateLesson(req.params.id, req.body, req.user!);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await lessonService.deleteLesson(req.params.id, req.user!);
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    return next(error);
  }
};
