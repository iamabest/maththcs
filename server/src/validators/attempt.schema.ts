import { z } from 'zod';

export const createAttemptSchema = z.object({
  body: z.object({
    quizId: z.string().min(1, 'Quiz ID là bắt buộc'),
    lessonId: z.string().min(1, 'Lesson ID là bắt buộc'),
    answers: z.record(z.string()),
    score: z.number().min(0),
    total: z.number().positive(),
    startedAt: z.string().optional(),
    submittedAt: z.string().optional(),
  }),
});

export const queryAttemptSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    studentId: z.string().optional(),
    quizId: z.string().optional(),
    lessonId: z.string().optional(),
  }),
});

export type CreateAttemptInput = z.infer<typeof createAttemptSchema>['body'];
