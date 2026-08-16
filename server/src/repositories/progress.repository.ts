import { LearningProgress, ProgressFilterOptions } from '../types/progress.js';
import { PaginatedResult, PaginationParams } from '../types/common.js';
import { IRepository } from './base.repository.js';

export interface IProgressRepository extends IRepository<LearningProgress, ProgressFilterOptions> {
  findByStudentAndLesson(studentId: string, lessonId: string): Promise<LearningProgress | null>;
  getAllByStudent(studentId: string): Promise<LearningProgress[]>;
}

export class InMemoryProgressRepository implements IProgressRepository {
  private progressMap: Map<string, LearningProgress> = new Map();

  private getKey(studentId: string, lessonId: string) {
    return `${studentId}:${lessonId}`;
  }

  async findById(id: string): Promise<LearningProgress | null> {
    const p = Array.from(this.progressMap.values()).find((item) => item.id === id);
    return p ? { ...p } : null;
  }

  async findByStudentAndLesson(
    studentId: string,
    lessonId: string
  ): Promise<LearningProgress | null> {
    const key = this.getKey(studentId, lessonId);
    const p = this.progressMap.get(key);
    return p ? { ...p } : null;
  }

  async getAllByStudent(studentId: string): Promise<LearningProgress[]> {
    return Array.from(this.progressMap.values())
      .filter((p) => p.studentId === studentId)
      .map((p) => ({ ...p }));
  }

  async findMany(
    params: PaginationParams,
    filter?: ProgressFilterOptions
  ): Promise<PaginatedResult<LearningProgress>> {
    let list = Array.from(this.progressMap.values());

    if (filter?.studentId) {
      list = list.filter((p) => p.studentId === filter.studentId);
    }
    if (filter?.lessonId) {
      list = list.filter((p) => p.lessonId === filter.lessonId);
    }

    const total = list.length;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit).map((p) => ({ ...p }));

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async create(data: Omit<LearningProgress, 'id'>): Promise<LearningProgress> {
    const id = `prog-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const progress: LearningProgress = {
      ...data,
      id,
    };
    const key = this.getKey(data.studentId, data.lessonId);
    this.progressMap.set(key, progress);
    return { ...progress };
  }

  async update(id: string, data: Partial<LearningProgress>): Promise<LearningProgress | null> {
    const existing = Array.from(this.progressMap.values()).find((p) => p.id === id);
    if (!existing) return null;

    const updated = { ...existing, ...data };
    const key = this.getKey(existing.studentId, existing.lessonId);
    this.progressMap.set(key, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    const existing = Array.from(this.progressMap.values()).find((p) => p.id === id);
    if (!existing) return false;
    const key = this.getKey(existing.studentId, existing.lessonId);
    return this.progressMap.delete(key);
  }
}

export const progressRepository = new InMemoryProgressRepository();
