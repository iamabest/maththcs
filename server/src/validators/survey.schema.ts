import { z } from 'zod';

export const createSurveySchema = z.object({
  body: z.object({
    instrumentId: z.string().min(1, 'Instrument ID là bắt buộc'),
    responses: z.record(z.number().int().min(1).max(5)),
    submittedAt: z.string().optional(),
  }),
});

export const querySurveySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    studentId: z.string().optional(),
    instrumentId: z.string().optional(),
  }),
});

export type CreateSurveyInput = z.infer<typeof createSurveySchema>['body'];
