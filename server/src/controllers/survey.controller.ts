import { Request, Response, NextFunction } from 'express';
import { surveyService } from '../services/survey.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const submitSurvey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const survey = await surveyService.submitSurvey(req.body, req.user!);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: survey,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSurveys = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, studentId, instrumentId } = req.query as any;
    const result = await surveyService.getSurveys(
      { page, limit },
      { studentId, instrumentId },
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
