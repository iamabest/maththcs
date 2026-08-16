export interface SurveyResponse {
  id: string;
  studentId: string;
  studentName?: string;
  instrumentId: string;
  responses: Record<string, number>;
  submittedAt: string;
}

export interface SurveyFilterOptions {
  studentId?: string;
  instrumentId?: string;
}
