import { Request, Response } from 'express';
import { HTTP_STATUS } from '../config/constants.js';

export const getHealth = (_req: Request, res: Response) => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      status: 'healthy',
      message: 'Math3D THCS REST API is running smoothly',
      timestamp: new Date().toISOString(),
      version: 'v1.0.0',
      uptime: process.uptime(),
    },
  });
};
