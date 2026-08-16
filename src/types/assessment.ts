import { QuestionType } from './index';

export interface AssessmentQuestion {
  id: string;
  content: string;
  type: QuestionType;
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Assessment {
  id: string;
  type: 'pretest' | 'posttest';
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

export interface SurveyItem {
  id: string;
  code: string;
  content: string;
  dimension: string;
}

export interface SurveyInstrument {
  id: string;
  title: string;
  description: string;
  scale: string[];
  items: SurveyItem[];
}

export interface SurveyResponse {
  instrumentId: string;
  responses: Record<string, number>;
  submittedAt: string;
}
