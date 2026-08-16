import { z } from 'zod';

export const updateProgressSchema = z.object({
  body: z.object({
    lessonId: z.string().min(1, 'Lesson ID là bắt buộc'),
    opened: z.boolean().optional(),
    simulationInteracted: z.boolean().optional(),
    quizCompleted: z.boolean().optional(),
    quizBestScore: z.number().nullable().optional(),
    quizBestTotal: z.number().nullable().optional(),
    completedAt: z.string().nullable().optional(),
  }),
});

export const queryProgressSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    studentId: z.string().optional(),
    lessonId: z.string().optional(),
  }),
});

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>['body'];
