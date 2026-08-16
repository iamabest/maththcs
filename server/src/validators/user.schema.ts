import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).default('STUDENT'),
    avatarUrl: z.string().url().optional().nullable(),
    isActive: z.boolean().default(true),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID người dùng là bắt buộc'),
  }),
  body: z.object({
    fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự').optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    isActive: z.boolean().optional(),
    password: z.string().min(6).optional(),
  }),
});

export const queryUserSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
    isActive: z.enum(['true', 'false']).transform((val) => val === 'true').optional(),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
