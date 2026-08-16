import { lessonRepository, ILessonRepository } from '../repositories/lesson.repository.js';
import { CreateLessonInput, UpdateLessonInput } from '../validators/lesson.schema.js';
import { Lesson, LessonFilterOptions } from '../types/lesson.js';
import { PaginatedResult, PaginationParams, UserJWTPayload } from '../types/common.js';
import { AppError } from '../middlewares/error.middleware.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';

export class LessonService {
  constructor(private lessonRepo: ILessonRepository = lessonRepository) {}

  async getLessons(
    params: PaginationParams,
    filter?: LessonFilterOptions,
    currentUser?: UserJWTPayload
  ): Promise<PaginatedResult<Lesson>> {
    const role = currentUser?.role;

    // Visibility rules:
    // If Student or Guest: only see PUBLISHED
    if (!currentUser || role === 'STUDENT') {
      filter = { ...filter, status: 'PUBLISHED' };
    } else if (role === 'TEACHER') {
      // Teachers see all PUBLISHED + their own DRAFTs
      // If a specific status filter wasn't requested, we allow their drafts or published
      if (!filter?.status && !filter?.teacherId) {
        // Teacher querying generally
      }
    }

    const result = await this.lessonRepo.findMany(params, filter);

    // Further filter for teachers if they shouldn't see other teachers' drafts
    if (role === 'TEACHER') {
      result.items = result.items.filter(
        (l) => l.status === 'PUBLISHED' || l.teacherId === currentUser?.id
      );
      result.total = result.items.length;
    }

    return result;
  }

  async getLessonById(idOrSlug: string, currentUser?: UserJWTPayload): Promise<Lesson> {
    let lesson = await this.lessonRepo.findById(idOrSlug);
    if (!lesson) {
      lesson = await this.lessonRepo.findBySlug(idOrSlug);
    }

    if (!lesson) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.LESSON_NOT_FOUND,
        'Không tìm thấy bài học'
      );
    }

    // Check visibility for draft lessons
    if (lesson.status === 'DRAFT') {
      const isAuthor = currentUser?.id === lesson.teacherId;
      const isAdmin = currentUser?.role === 'ADMIN';

      if (!isAuthor && !isAdmin) {
        throw new AppError(
          HTTP_STATUS.FORBIDDEN,
          ERROR_CODES.FORBIDDEN,
          'Bài học này đang ở trạng thái nháp và chưa được công khai'
        );
      }
    }

    return lesson;
  }

  async createLesson(input: CreateLessonInput, currentUser: UserJWTPayload): Promise<Lesson> {
    if (currentUser.role !== 'TEACHER' && currentUser.role !== 'ADMIN') {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Chỉ Giáo viên (TEACHER) hoặc Quản trị viên (ADMIN) mới có quyền tạo bài học'
      );
    }

    const existingSlug = await this.lessonRepo.findBySlug(input.slug);
    if (existingSlug) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.INVALID_INPUT,
        `Slug bài học '${input.slug}' đã tồn tại, vui lòng chọn slug khác`
      );
    }

    const lesson = await this.lessonRepo.create({
      ...input,
      teacherId: currentUser.id,
      teacherName: currentUser.fullName,
    });

    return lesson;
  }

  async updateLesson(
    id: string,
    input: UpdateLessonInput,
    currentUser: UserJWTPayload
  ): Promise<Lesson> {
    const existing = await this.lessonRepo.findById(id);
    if (!existing) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.LESSON_NOT_FOUND,
        'Không tìm thấy bài học để chỉnh sửa'
      );
    }

    const isAuthor = currentUser.id === existing.teacherId;
    const isAdmin = currentUser.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Bạn không có quyền chỉnh sửa bài học của giáo viên khác'
      );
    }

    if (input.slug && input.slug !== existing.slug) {
      const duplicate = await this.lessonRepo.findBySlug(input.slug);
      if (duplicate && duplicate.id !== id) {
        throw new AppError(
          HTTP_STATUS.CONFLICT,
          ERROR_CODES.INVALID_INPUT,
          `Slug '${input.slug}' đã được sử dụng bởi bài học khác`
        );
      }
    }

    const updated = await this.lessonRepo.update(id, input);
    if (!updated) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.LESSON_NOT_FOUND,
        'Cập nhật bài học thất bại'
      );
    }

    return updated;
  }

  async deleteLesson(id: string, currentUser: UserJWTPayload): Promise<void> {
    const existing = await this.lessonRepo.findById(id);
    if (!existing) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.LESSON_NOT_FOUND,
        'Không tìm thấy bài học để xóa'
      );
    }

    const isAuthor = currentUser.id === existing.teacherId;
    const isAdmin = currentUser.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Bạn không có quyền xóa bài học của giáo viên khác'
      );
    }

    await this.lessonRepo.delete(id);
  }
}

export const lessonService = new LessonService();
