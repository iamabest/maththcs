import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import { HTTP_STATUS, ERROR_CODES } from './config/constants.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import apiRouter from './routes/index.js';

export const createApp = (): Express => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: [ENV.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging middleware
  app.use(requestLogger);

  // API v1 Routes
  app.use('/api/v1', apiRouter);

  // Root redirect/welcome
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      message: 'Math3D THCS API Server',
      docs: '/api/v1/health',
      version: 'v1.0.0',
    });
  });

  // 404 Not Found Handler
  app.use((req: Request, res: Response) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: {
        code: ERROR_CODES.NOT_FOUND,
        message: `Đường dẫn [${req.method}] ${req.originalUrl} không tồn tại trên hệ thống`,
      },
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
