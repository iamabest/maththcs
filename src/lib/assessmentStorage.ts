// ============================================================
// Assessment & Survey Storage Adapter (Dual Sync)
// ============================================================

import { surveyApi, attemptsApi } from '../services/api';

export function saveAssessmentResult(
  type: 'pretest' | 'posttest',
  score: number,
  total: number,
  answers: Record<string, string>
) {
  const result = {
    type,
    score,
    total,
    answers,
    completedAt: new Date().toISOString(),
  };
  const results = getAssessmentResults();
  results[type] = result;
  localStorage.setItem('math3d_assessments', JSON.stringify(results));

  // Sync to API attempts
  if (localStorage.getItem('math3d_token')) {
    attemptsApi
      .createAttempt({
        quizId: `assessment-${type}`,
        lessonId: `formal-assessment-${type}`,
        answers,
        score,
        total,
        startedAt: result.completedAt,
        submittedAt: result.completedAt,
      })
      .catch(() => {});
  }
}

export function getAssessmentResults(): Record<string, any> {
  const data = localStorage.getItem('math3d_assessments');
  return data ? JSON.parse(data) : {};
}

export function saveSurveyResponse(response: {
  instrumentId: string;
  responses: Record<string, number>;
  submittedAt: string;
}) {
  const responses = getSurveyResponses();
  responses.push(response);
  localStorage.setItem('math3d_surveys', JSON.stringify(responses));

  // Sync to API surveys
  if (localStorage.getItem('math3d_token')) {
    surveyApi
      .submitSurvey({
        instrumentId: response.instrumentId,
        responses: response.responses,
        submittedAt: response.submittedAt,
      })
      .catch(() => {});
  }
}

export function getSurveyResponses(): any[] {
  const data = localStorage.getItem('math3d_surveys');
  return data ? JSON.parse(data) : [];
}
