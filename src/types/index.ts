// ============================================================
// Types - He thong Mo phong 3D Toan THCS
// ============================================================

/** Vai trò người dùng */
export type UserRole = 'student' | 'teacher' | 'admin';

/** Khối lớp */
export type Grade = 6 | 7 | 8 | 9;

/** Mã năng lực toán học */
export type Competency =
  | 'MAT_REASONING'
  | 'MAT_PROBLEM_SOLVING'
  | 'MAT_MODELING'
  | 'MAT_COMMUNICATION'
  | 'MAT_TOOLS'
  | 'DIGITAL_COMPETENCE';

/** Mức độ nhận thức */
export type CognitiveLevel = 'remember' | 'understand' | 'apply' | 'analyze';

/** Độ khó */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** Loại câu hỏi */
export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_number';

// ---- Simulation ----

export interface SimulationVariable {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

export interface SimulationMeta {
  id: string;
  slug: string;
  grade: Grade;
  topic: string;
  title: string;
  description: string;
  objectives: string[];
  variables: SimulationVariable[];
  competencies: Competency[];
}

// ---- Lesson ----

export interface LessonActivity {
  id: string;
  type: 'intro' | 'explore' | 'practice' | 'apply' | 'assess';
  title: string;
  content: string;
  simulationSlug?: string;
}

export interface Lesson {
  id: string;
  slug?: string;
  grade: Grade;
  topic: string;
  title: string;
  description: string;
  objectives: string[];
  prerequisites: string[];
  estimatedTime: number; // phút
  simulationSlug: string;
  activities: LessonActivity[];
  competencies: Competency[];
}

// ---- Quiz ----

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  type: QuestionType;
  content: string;
  options?: QuizOption[];
  correctAnswer: string; // option id, 'true'/'false', hoặc số
  tolerance?: number; // cho fill_number
  explanation: string;
  difficulty: Difficulty;
  competency: Competency;
  cognitiveLevel: CognitiveLevel;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
}

// ---- Progress & Attempts ----

export interface QuizAttempt {
  id: string;
  quizId: string;
  lessonId: string;
  answers: Record<string, string>; // questionId -> answer
  score: number;
  total: number;
  startedAt: string;
  submittedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  opened: boolean;
  simulationInteracted: boolean;
  quizCompleted: boolean;
  quizBestScore: number | null;
  quizBestTotal: number | null;
  lastAccessedAt: string;
  completedAt: string | null;
}

export interface SimulationEvent {
  simulationSlug: string;
  eventType: 'open' | 'parameter_change' | 'reset' | 'close';
  payload?: Record<string, unknown>;
  occurredAt: string;
}

// ---- Dashboard ----

export interface DashboardStats {
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  totalQuizAttempts: number;
  competencyScores: Record<Competency, { correct: number; total: number }>;
  recentActivity: Array<{
    type: 'lesson' | 'quiz' | 'simulation';
    title: string;
    timestamp: string;
    detail?: string;
  }>;
}
