import { progressRepository, IProgressRepository } from '../repositories/progress.repository.js';
import { UpdateProgressInput } from '../validators/progress.schema.js';
import { LearningProgress, ProgressFilterOptions } from '../types/progress.js';
import { PaginatedResult, PaginationParams, UserJWTPayload } from '../types/common.js';

export class ProgressService {
  constructor(private progressRepo: IProgressRepository = progressRepository) {}

  async updateProgress(
    input: UpdateProgressInput,
    currentUser: UserJWTPayload
  ): Promise<LearningProgress> {
    const now = new Date().toISOString();
    let existing = await this.progressRepo.findByStudentAndLesson(
      currentUser.id,
      input.lessonId
    );

    if (existing) {
      const updated = await this.progressRepo.update(existing.id, {
        opened: input.opened !== undefined ? input.opened : existing.opened,
        simulationInteracted:
          input.simulationInteracted !== undefined
            ? input.simulationInteracted
            : existing.simulationInteracted,
        quizCompleted:
          input.quizCompleted !== undefined ? input.quizCompleted : existing.quizCompleted,
        quizBestScore:
          input.quizBestScore !== undefined ? input.quizBestScore : existing.quizBestScore,
        quizBestTotal:
          input.quizBestTotal !== undefined ? input.quizBestTotal : existing.quizBestTotal,
        lastAccessedAt: now,
        completedAt:
          input.completedAt !== undefined ? input.completedAt : existing.completedAt,
      });
      return updated!;
    } else {
      const created = await this.progressRepo.create({
        studentId: currentUser.id,
        lessonId: input.lessonId,
        opened: input.opened ?? true,
        simulationInteracted: input.simulationInteracted ?? false,
        quizCompleted: input.quizCompleted ?? false,
        quizBestScore: input.quizBestScore ?? null,
        quizBestTotal: input.quizBestTotal ?? null,
        lastAccessedAt: now,
        completedAt: input.completedAt ?? null,
      });
      return created;
    }
  }

  async getProgress(
    params: PaginationParams,
    filter?: ProgressFilterOptions,
    currentUser?: UserJWTPayload
  ): Promise<PaginatedResult<LearningProgress>> {
    if (currentUser && currentUser.role === 'STUDENT') {
      filter = { ...filter, studentId: currentUser.id };
    }

    return this.progressRepo.findMany(params, filter);
  }
}

export const progressService = new ProgressService();
