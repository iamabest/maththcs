import { z } from 'zod';

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Tiêu đề bài học phải có ít nhất 3 ký tự'),
    slug: z.string().min(3, 'Slug phải có ít nhất 3 ký tự').regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm chữ thường, số và dấu gạch ngang'),
    description: z.string().optional().nullable(),
    grade: z.number().int().min(6).max(9, 'Khối lớp từ 6 đến 9'),
    subject: z.string().default('Toán'),
    topic: z.string().optional(),
    objectives: z.array(z.string()).optional(),
    content: z.any().optional(),
    prerequisites: z.array(z.string()).optional(),
    estimatedTime: z.number().int().positive().optional(),
    simulationSlug: z.string().optional(),
    competencies: z.array(z.string()).optional(),
    activities: z.array(z.object({
      id: z.string(),
      type: z.enum(['intro', 'explore', 'practice', 'apply', 'assess']),
      title: z.string(),
      content: z.string(),
      simulationSlug: z.string().optional(),
      orderIndex: z.number().optional(),
    })).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  }),
});

export const updateLessonSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID bài học là bắt buộc'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
    description: z.string().optional().nullable(),
    grade: z.number().int().min(6).max(9).optional(),
    subject: z.string().optional(),
    topic: z.string().optional(),
    objectives: z.array(z.string()).optional(),
    content: z.any().optional(),
    prerequisites: z.array(z.string()).optional(),
    estimatedTime: z.number().int().positive().optional(),
    simulationSlug: z.string().optional(),
    competencies: z.array(z.string()).optional(),
    activities: z.array(z.any()).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
});

export const queryLessonSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    grade: z.coerce.number().int().min(6).max(9).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    search: z.string().optional(),
    teacherId: z.string().optional(),
  }),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>['body'];
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>['body'];
