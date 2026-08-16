// ============================================================
// API Client Service — Kết nối REST API Server (Port 5000)
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}

export interface PaginatedUsers {
  items: ApiUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiLesson {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  grade: number;
  subject: string;
  topic?: string;
  objectives?: string[];
  content?: string;
  prerequisites?: string[];
  estimatedTime?: number;
  simulationSlug?: string;
  competencies?: string[];
  activities?: Array<{
    id: string;
    type: 'intro' | 'explore' | 'practice' | 'apply' | 'assess';
    title: string;
    content: string;
    simulationSlug?: string;
  }>;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  teacherId: string;
  teacherName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAttempt {
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

export interface ApiProgress {
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

export interface ApiSurvey {
  id: string;
  studentId: string;
  studentName?: string;
  instrumentId: string;
  responses: Record<string, number>;
  submittedAt: string;
}

class ApiError extends Error {
  public code: string;
  public details?: any;
  public status: number;

  constructor(status: number, code: string, message: string, details?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Helper to perform HTTP requests with Bearer token
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('math3d_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'Không thể kết nối đến máy chủ backend (http://localhost:5000). Vui lòng đảm bảo server đã được khởi động bằng lệnh "npm run server:dev".'
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    const error = data.error || {};
    throw new ApiError(
      response.status,
      error.code || 'UNKNOWN_ERROR',
      error.message || `Lỗi yêu cầu HTTP ${response.status}`,
      error.details
    );
  }

  return data.data as T;
}

// ------------------------------------------------------------
// Auth API
// ------------------------------------------------------------
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    role: 'STUDENT' | 'TEACHER';
  }): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async (): Promise<ApiUser> => {
    return request<ApiUser>('/auth/me');
  },
};

// ------------------------------------------------------------
// User Management CRUD API
// ------------------------------------------------------------
export const usersApi = {
  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  } = {}): Promise<PaginatedUsers> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.search) query.append('search', params.search);
    if (params.role) query.append('role', params.role);
    if (params.isActive !== undefined) query.append('isActive', String(params.isActive));

    return request<PaginatedUsers>(`/users?${query.toString()}`);
  },

  getUserById: async (id: string): Promise<ApiUser> => {
    return request<ApiUser>(`/users/${id}`);
  },

  createUser: async (data: {
    email: string;
    password: string;
    fullName: string;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
    isActive?: boolean;
  }): Promise<ApiUser> => {
    return request<ApiUser>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateUser: async (
    id: string,
    data: {
      fullName?: string;
      role?: 'ADMIN' | 'TEACHER' | 'STUDENT';
      isActive?: boolean;
      password?: string;
    }
  ): Promise<ApiUser> => {
    return request<ApiUser>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteUser: async (id: string): Promise<void> => {
    return request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// ------------------------------------------------------------
// Lessons CRUD API
// ------------------------------------------------------------
export const lessonsApi = {
  getLessons: async (params: {
    page?: number;
    limit?: number;
    grade?: number;
    status?: string;
    search?: string;
    teacherId?: string;
  } = {}): Promise<{ items: ApiLesson[]; total: number }> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.grade) query.append('grade', String(params.grade));
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.teacherId) query.append('teacherId', params.teacherId);

    return request<{ items: ApiLesson[]; total: number }>(`/lessons?${query.toString()}`);
  },

  getLessonById: async (idOrSlug: string): Promise<ApiLesson> => {
    return request<ApiLesson>(`/lessons/${idOrSlug}`);
  },

  createLesson: async (data: Partial<ApiLesson>): Promise<ApiLesson> => {
    return request<ApiLesson>('/lessons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateLesson: async (id: string, data: Partial<ApiLesson>): Promise<ApiLesson> => {
    return request<ApiLesson>(`/lessons/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteLesson: async (id: string): Promise<void> => {
    return request<void>(`/lessons/${id}`, {
      method: 'DELETE',
    });
  },
};

// ------------------------------------------------------------
// Attempts & Scoring API (Task 3)
// ------------------------------------------------------------
export const attemptsApi = {
  createAttempt: async (data: {
    quizId: string;
    lessonId: string;
    answers: Record<string, string>;
    score: number;
    total: number;
    startedAt?: string;
    submittedAt?: string;
  }): Promise<ApiAttempt> => {
    return request<ApiAttempt>('/attempts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAttempts: async (params: {
    page?: number;
    limit?: number;
    studentId?: string;
    quizId?: string;
    lessonId?: string;
  } = {}): Promise<{ items: ApiAttempt[]; total: number }> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.studentId) query.append('studentId', params.studentId);
    if (params.quizId) query.append('quizId', params.quizId);
    if (params.lessonId) query.append('lessonId', params.lessonId);

    return request<{ items: ApiAttempt[]; total: number }>(`/attempts?${query.toString()}`);
  },
};

// ------------------------------------------------------------
// Learning Progress API (Task 3)
// ------------------------------------------------------------
export const progressApi = {
  updateProgress: async (data: {
    lessonId: string;
    opened?: boolean;
    simulationInteracted?: boolean;
    quizCompleted?: boolean;
    quizBestScore?: number | null;
    quizBestTotal?: number | null;
    completedAt?: string | null;
  }): Promise<ApiProgress> => {
    return request<ApiProgress>('/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProgress: async (params: {
    page?: number;
    limit?: number;
    studentId?: string;
    lessonId?: string;
  } = {}): Promise<{ items: ApiProgress[]; total: number }> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.studentId) query.append('studentId', params.studentId);
    if (params.lessonId) query.append('lessonId', params.lessonId);

    return request<{ items: ApiProgress[]; total: number }>(`/progress?${query.toString()}`);
  },
};

// ------------------------------------------------------------
// Survey Responses API (Task 3)
// ------------------------------------------------------------
export const surveyApi = {
  submitSurvey: async (data: {
    instrumentId: string;
    responses: Record<string, number>;
    submittedAt?: string;
  }): Promise<ApiSurvey> => {
    return request<ApiSurvey>('/surveys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSurveys: async (params: {
    page?: number;
    limit?: number;
    studentId?: string;
    instrumentId?: string;
  } = {}): Promise<{ items: ApiSurvey[]; total: number }> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.studentId) query.append('studentId', params.studentId);
    if (params.instrumentId) query.append('instrumentId', params.instrumentId);

    return request<{ items: ApiSurvey[]; total: number }>(`/surveys?${query.toString()}`);
  },
};

// ------------------------------------------------------------
// Health Check API
// ------------------------------------------------------------
export const healthApi = {
  check: async (): Promise<{ status: string; version: string; message: string }> => {
    return request<{ status: string; version: string; message: string }>('/health');
  },
};

export { ApiError };
