export type LessonStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface LessonActivity {
  id: string;
  type: 'intro' | 'explore' | 'practice' | 'apply' | 'assess';
  title: string;
  content: string;
  simulationSlug?: string;
  orderIndex?: number;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  grade: number; // 6, 7, 8, 9
  subject: string; // "Toán"
  topic?: string;
  objectives?: string[] | any;
  content?: string | any;
  prerequisites?: string[];
  estimatedTime?: number;
  simulationSlug?: string;
  competencies?: string[];
  activities?: LessonActivity[];
  status: LessonStatus;
  teacherId: string;
  teacherName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonFilterOptions {
  grade?: number;
  status?: LessonStatus;
  search?: string;
  teacherId?: string;
}
