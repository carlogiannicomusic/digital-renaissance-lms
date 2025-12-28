import { z } from 'zod'

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional(),
  teacherId: z.string().uuid('Invalid teacher ID'),
})

export const updateCourseSchema = z.object({
  id: z.string().uuid('Invalid course ID'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long').optional(),
  description: z.string().optional(),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
