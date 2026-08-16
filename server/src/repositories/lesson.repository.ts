import { Lesson, LessonFilterOptions } from '../types/lesson.js';
import { PaginatedResult, PaginationParams } from '../types/common.js';
import { IRepository } from './base.repository.js';
import { getInitialLessons } from './seed-data.js';

export interface ILessonRepository extends IRepository<Lesson, LessonFilterOptions> {
  findBySlug(slug: string): Promise<Lesson | null>;
}

export class InMemoryLessonRepository implements ILessonRepository {
  private lessons: Map<string, Lesson> = new Map();

  constructor() {
    getInitialLessons().forEach((lesson) => {
      this.lessons.set(lesson.id, lesson);
    });
  }

  async findById(id: string): Promise<Lesson | null> {
    const lesson = this.lessons.get(id);
    return lesson ? { ...lesson } : null;
  }

  async findBySlug(slug: string): Promise<Lesson | null> {
    const lesson = Array.from(this.lessons.values()).find(
      (l) => l.slug.toLowerCase() === slug.toLowerCase()
    );
    return lesson ? { ...lesson } : null;
  }

  async findMany(
    params: PaginationParams,
    filter?: LessonFilterOptions
  ): Promise<PaginatedResult<Lesson>> {
    let list = Array.from(this.lessons.values());

    if (filter?.grade) {
      list = list.filter((l) => l.grade === filter.grade);
    }

    if (filter?.status) {
      list = list.filter((l) => l.status === filter.status);
    }

    if (filter?.teacherId) {
      list = list.filter((l) => l.teacherId === filter.teacherId);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.description && l.description.toLowerCase().includes(q)) ||
          (l.topic && l.topic.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit).map((l) => ({ ...l }));

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async create(data: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lesson> {
    const now = new Date().toISOString();
    const id = `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const lesson: Lesson = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.lessons.set(id, lesson);
    return { ...lesson };
  }

  async update(id: string, data: Partial<Lesson>): Promise<Lesson | null> {
    const existing = this.lessons.get(id);
    if (!existing) return null;

    const updated: Lesson = {
      ...existing,
      ...data,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };
    this.lessons.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    return this.lessons.delete(id);
  }
}

// Singleton repository instance
export const lessonRepository = new InMemoryLessonRepository();
