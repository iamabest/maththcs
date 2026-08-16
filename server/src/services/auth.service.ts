import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository, IUserRepository } from '../repositories/user.repository.js';
import { RegisterInput, LoginInput } from '../validators/auth.schema.js';
import { SafeUser } from '../types/user.js';
import { UserJWTPayload } from '../types/common.js';
import { ENV } from '../config/env.js';
import { AppError } from '../middlewares/error.middleware.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';

export class AuthService {
  constructor(private userRepo: IUserRepository = userRepository) {}

  private generateToken(payload: UserJWTPayload): string {
    return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN as any,
    });
  }

  private sanitizeUser(user: any): SafeUser {
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async register(input: RegisterInput): Promise<{ user: SafeUser; token: string }> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.USER_EXISTS,
        'Email này đã được đăng ký trong hệ thống'
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(input.password, salt);

    const newUser = await this.userRepo.create({
      email: input.email.toLowerCase(),
      passwordHash,
      fullName: input.fullName,
      role: input.role || 'STUDENT',
      avatarUrl: null,
      isActive: true,
    });

    const safeUser = this.sanitizeUser(newUser);
    const token = this.generateToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      fullName: safeUser.fullName,
    });

    return { user: safeUser, token };
  }

  async login(input: LoginInput): Promise<{ user: SafeUser; token: string }> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user || !user.passwordHash) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_CREDENTIALS,
        'Email hoặc mật khẩu không chính xác'
      );
    }

    if (!user.isActive) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Tài khoản này đã bị khóa. Vui lòng liên hệ quản trị viên.'
      );
    }

    const isMatch = bcrypt.compareSync(input.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_CREDENTIALS,
        'Email hoặc mật khẩu không chính xác'
      );
    }

    const safeUser = this.sanitizeUser(user);
    const token = this.generateToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      fullName: safeUser.fullName,
    });

    return { user: safeUser, token };
  }

  async getMe(userId: string): Promise<SafeUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Không tìm thấy thông tin người dùng'
      );
    }
    return this.sanitizeUser(user);
  }
}

export const authService = new AuthService();
