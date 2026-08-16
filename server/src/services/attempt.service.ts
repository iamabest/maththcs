import { attemptRepository, IAttemptRepository } from '../repositories/attempt.repository.js';
import { progressRepository, IProgressRepository } from '../repositories/progress.repository.js';
import { CreateAttemptInput } from '../validators/attempt.schema.js';
import { QuizAttempt, AttemptFilterOptions } from '../types/attempt.js';
import { PaginatedResult, PaginationParams, UserJWTPayload } from '../types/common.js';

export class AttemptService {
  constructor(
    private attemptRepo: IAttemptRepository = attemptRepository,
    private progressRepo: IProgressRepository = progressRepository
  ) {}

  async createAttempt(
    input: CreateAttemptInput,
    currentUser: UserJWTPayload
  ): Promise<QuizAttempt> {
    const now = new Date().toISOString();
    const attempt = await this.attemptRepo.create({
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      quizId: input.quizId,
      lessonId: input.lessonId,
      answers: input.answers,
      score: input.score,
      total: input.total,
      startedAt: input.startedAt || now,
      submittedAt: input.submittedAt || now,
    });

    // Auto update student's progress for this lesson
    const currentProgress = await this.progressRepo.findByStudentAndLesson(
      currentUser.id,
      input.lessonId
    );

    const isBest =
      !currentProgress ||
      currentProgress.quizBestScore === null ||
      input.score > currentProgress.quizBestScore;

    if (currentProgress) {
      await this.progressRepo.update(currentProgress.id, {
        quizCompleted: true,
        quizBestScore: isBest ? input.score : currentProgress.quizBestScore,
        quizBestTotal: isBest ? input.total : currentProgress.quizBestTotal,
        lastAccessedAt: now,
        completedAt:
          currentProgress.completedAt || (input.score / input.total >= 0.7 ? now : null),
      });
    } else {
      await this.progressRepo.create({
        studentId: currentUser.id,
        lessonId: input.lessonId,
        opened: true,
        simulationInteracted: false,
        quizCompleted: true,
        quizBestScore: input.score,
        quizBestTotal: input.total,
        lastAccessedAt: now,
        completedAt: input.score / input.total >= 0.7 ? now : null,
      });
    }

    return attempt;
  }

  async getAttempts(
    params: PaginationParams,
    filter?: AttemptFilterOptions,
    currentUser?: UserJWTPayload
  ): Promise<PaginatedResult<QuizAttempt>> {
    // If student, can only view own attempts
    if (currentUser && currentUser.role === 'STUDENT') {
      filter = { ...filter, studentId: currentUser.id };
    }

    return this.attemptRepo.findMany(params, filter);
  }
}

export const attemptService = new AttemptService();
