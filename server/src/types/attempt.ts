export interface QuizAttempt {
  id: string;
  studentId: string;
  studentName?: string;
  quizId: string;
  lessonId: string;
  answers: Record<string, string>;
  score: number;
  total: number;
  startedAt: string;
  submittedAt: string;
}

export interface AttemptFilterOptions {
  studentId?: string;
  quizId?: string;
  lessonId?: string;
}
