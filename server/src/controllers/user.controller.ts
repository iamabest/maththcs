import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { HTTP_STATUS } from '../config/constants.js';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, role, isActive } = req.query as any;
    const result = await userService.getUsers({ page, limit }, { search, role, isActive });
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id, req.user);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user!);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(req.params.id, req.user!);
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    return next(error);
  }
};
