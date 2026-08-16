import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';
import { UserJWTPayload } from '../types/common.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserJWTPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Chưa đăng nhập hoặc thiếu Bearer Token',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as UserJWTPayload;
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Token không hợp lệ hoặc đã hết hạn',
      },
    });
  }
};

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as UserJWTPayload;
      req.user = decoded;
    } catch {
      // Ignore token verification failure for optional auth
    }
  }

  return next();
};
