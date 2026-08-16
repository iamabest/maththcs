import { QuizAttempt, AttemptFilterOptions } from '../types/attempt.js';
import { PaginatedResult, PaginationParams } from '../types/common.js';
import { IRepository } from './base.repository.js';

export interface IAttemptRepository extends IRepository<QuizAttempt, AttemptFilterOptions> {
  findByStudentAndQuiz(studentId: string, quizId: string): Promise<QuizAttempt[]>;
}

export class InMemoryAttemptRepository implements IAttemptRepository {
  private attempts: Map<string, QuizAttempt> = new Map();

  async findById(id: string): Promise<QuizAttempt | null> {
    const attempt = this.attempts.get(id);
    return attempt ? { ...attempt } : null;
  }

  async findByStudentAndQuiz(studentId: string, quizId: string): Promise<QuizAttempt[]> {
    return Array.from(this.attempts.values())
      .filter((a) => a.studentId === studentId && a.quizId === quizId)
      .map((a) => ({ ...a }));
  }

  async findMany(
    params: PaginationParams,
    filter?: AttemptFilterOptions
  ): Promise<PaginatedResult<QuizAttempt>> {
    let list = Array.from(this.attempts.values());

    if (filter?.studentId) {
      list = list.filter((a) => a.studentId === filter.studentId);
    }
    if (filter?.quizId) {
      list = list.filter((a) => a.quizId === filter.quizId);
    }
    if (filter?.lessonId) {
      list = list.filter((a) => a.lessonId === filter.lessonId);
    }

    // Sort descending by submittedAt
    list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const total = list.length;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit).map((a) => ({ ...a }));

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async create(data: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt> {
    const id = `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const attempt: QuizAttempt = {
      ...data,
      id,
    };
    this.attempts.set(id, attempt);
    return { ...attempt };
  }

  async update(id: string, data: Partial<QuizAttempt>): Promise<QuizAttempt | null> {
    const existing = this.attempts.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data };
    this.attempts.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    return this.attempts.delete(id);
  }
}

export const attemptRepository = new InMemoryAttemptRepository();
