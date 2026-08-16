import bcrypt from 'bcryptjs';
import { userRepository, IUserRepository } from '../repositories/user.repository.js';
import { CreateUserInput, UpdateUserInput } from '../validators/user.schema.js';
import { SafeUser, UserFilterOptions } from '../types/user.js';
import { PaginatedResult, PaginationParams, UserJWTPayload } from '../types/common.js';
import { AppError } from '../middlewares/error.middleware.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';

export class UserService {
  constructor(private userRepo: IUserRepository = userRepository) {}

  private sanitizeUser(user: any): SafeUser {
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async getUsers(
    params: PaginationParams,
    filter?: UserFilterOptions
  ): Promise<PaginatedResult<SafeUser>> {
    const result = await this.userRepo.findMany(params, filter);
    return {
      ...result,
      items: result.items.map((u) => this.sanitizeUser(u)),
    };
  }

  async getUserById(id: string, currentUser?: UserJWTPayload): Promise<SafeUser> {
    // Permission check: Admin or the user itself
    if (currentUser && currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Bạn không có quyền xem thông tin của người dùng khác'
      );
    }

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Không tìm thấy người dùng'
      );
    }
    return this.sanitizeUser(user);
  }

  async createUser(input: CreateUserInput): Promise<SafeUser> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.USER_EXISTS,
        'Email này đã được sử dụng trong hệ thống'
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(input.password, salt);

    const user = await this.userRepo.create({
      email: input.email.toLowerCase(),
      passwordHash,
      fullName: input.fullName,
      role: input.role || 'STUDENT',
      avatarUrl: input.avatarUrl || null,
      isActive: input.isActive ?? true,
    });

    return this.sanitizeUser(user);
  }

  async updateUser(
    id: string,
    input: UpdateUserInput,
    currentUser: UserJWTPayload
  ): Promise<SafeUser> {
    const existing = await this.userRepo.findById(id);
    if (!existing) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Không tìm thấy người dùng để cập nhật'
      );
    }

    // Permission check: Admin or self
    const isAdmin = currentUser.role === 'ADMIN';
    const isSelf = currentUser.id === id;

    if (!isAdmin && !isSelf) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Bạn không có quyền chỉnh sửa thông tin của người dùng khác'
      );
    }

    // Only Admin can change role or isActive status
    if (input.role && !isAdmin && input.role !== existing.role) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Chỉ Quản trị viên (ADMIN) mới có quyền thay đổi vai trò người dùng'
      );
    }

    if (input.isActive !== undefined && !isAdmin) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Chỉ Quản trị viên (ADMIN) mới có quyền khóa/mở tài khoản'
      );
    }

    const updateData: any = { ...input };

    if (input.password) {
      const salt = bcrypt.genSaltSync(10);
      updateData.passwordHash = bcrypt.hashSync(input.password, salt);
      delete updateData.password;
    }

    const updated = await this.userRepo.update(id, updateData);
    if (!updated) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Cập nhật người dùng thất bại'
      );
    }

    return this.sanitizeUser(updated);
  }

  async deleteUser(id: string, currentUser: UserJWTPayload): Promise<void> {
    if (currentUser.role !== 'ADMIN') {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Chỉ Quản trị viên (ADMIN) mới có quyền xóa người dùng'
      );
    }

    if (currentUser.id === id) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.INVALID_INPUT,
        'Không thể tự xóa tài khoản của chính mình'
      );
    }

    const existing = await this.userRepo.findById(id);
    if (!existing) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Không tìm thấy người dùng để xóa'
      );
    }

    await this.userRepo.delete(id);
  }
}

export const userService = new UserService();
