import { surveyRepository, ISurveyRepository } from '../repositories/survey.repository.js';
import { CreateSurveyInput } from '../validators/survey.schema.js';
import { SurveyResponse, SurveyFilterOptions } from '../types/survey.js';
import { PaginatedResult, PaginationParams, UserJWTPayload } from '../types/common.js';

export class SurveyService {
  constructor(private surveyRepo: ISurveyRepository = surveyRepository) {}

  async submitSurvey(
    input: CreateSurveyInput,
    currentUser: UserJWTPayload
  ): Promise<SurveyResponse> {
    const now = new Date().toISOString();
    const existing = await this.surveyRepo.findByStudentAndInstrument(
      currentUser.id,
      input.instrumentId
    );

    if (existing) {
      const updated = await this.surveyRepo.update(existing.id, {
        responses: input.responses,
        submittedAt: input.submittedAt || now,
      });
      return updated!;
    } else {
      const created = await this.surveyRepo.create({
        studentId: currentUser.id,
        studentName: currentUser.fullName,
        instrumentId: input.instrumentId,
        responses: input.responses,
        submittedAt: input.submittedAt || now,
      });
      return created;
    }
  }

  async getSurveys(
    params: PaginationParams,
    filter?: SurveyFilterOptions,
    currentUser?: UserJWTPayload
  ): Promise<PaginatedResult<SurveyResponse>> {
    if (currentUser && currentUser.role === 'STUDENT') {
      filter = { ...filter, studentId: currentUser.id };
    }

    return this.surveyRepo.findMany(params, filter);
  }
}

export const surveyService = new SurveyService();
