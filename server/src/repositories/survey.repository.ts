import { SurveyResponse, SurveyFilterOptions } from '../types/survey.js';
import { PaginatedResult, PaginationParams } from '../types/common.js';
import { IRepository } from './base.repository.js';

export interface ISurveyRepository extends IRepository<SurveyResponse, SurveyFilterOptions> {
  findByStudentAndInstrument(
    studentId: string,
    instrumentId: string
  ): Promise<SurveyResponse | null>;
}

export class InMemorySurveyRepository implements ISurveyRepository {
  private surveys: Map<string, SurveyResponse> = new Map();

  async findById(id: string): Promise<SurveyResponse | null> {
    const s = this.surveys.get(id);
    return s ? { ...s } : null;
  }

  async findByStudentAndInstrument(
    studentId: string,
    instrumentId: string
  ): Promise<SurveyResponse | null> {
    const found = Array.from(this.surveys.values()).find(
      (s) => s.studentId === studentId && s.instrumentId === instrumentId
    );
    return found ? { ...found } : null;
  }

  async findMany(
    params: PaginationParams,
    filter?: SurveyFilterOptions
  ): Promise<PaginatedResult<SurveyResponse>> {
    let list = Array.from(this.surveys.values());

    if (filter?.studentId) {
      list = list.filter((s) => s.studentId === filter.studentId);
    }
    if (filter?.instrumentId) {
      list = list.filter((s) => s.instrumentId === filter.instrumentId);
    }

    list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const total = list.length;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit).map((s) => ({ ...s }));

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async create(data: Omit<SurveyResponse, 'id'>): Promise<SurveyResponse> {
    const id = `surv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const survey: SurveyResponse = {
      ...data,
      id,
    };
    this.surveys.set(id, survey);
    return { ...survey };
  }

  async update(id: string, data: Partial<SurveyResponse>): Promise<SurveyResponse | null> {
    const existing = this.surveys.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data };
    this.surveys.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    return this.surveys.delete(id);
  }
}

export const surveyRepository = new InMemorySurveyRepository();
