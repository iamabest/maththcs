export interface LearningProgress {
  id: string;
  studentId: string;
  lessonId: string;
  opened: boolean;
  simulationInteracted: boolean;
  quizCompleted: boolean;
  quizBestScore: number | null;
  quizBestTotal: number | null;
  lastAccessedAt: string;
  completedAt: string | null;
}

export interface ProgressFilterOptions {
  studentId?: string;
  lessonId?: string;
}
