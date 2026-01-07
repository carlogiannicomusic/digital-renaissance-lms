import { z } from 'zod'
import { dayOfWeekEnum } from './schedule'

// Student Group Schemas
export const createGroupSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  name: z.string()
    .min(1, 'Group name is required')
    .max(100, 'Group name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  maxCapacity: z.number().int().positive().optional(),
})

export const updateGroupSchema = z.object({
  name: z.string()
    .min(1, 'Group name is required')
    .max(100, 'Group name is too long')
    .optional(),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
  maxCapacity: z.number().int().positive().optional().nullable(),
})

export const duplicateGroupSchema = z.object({
  newName: z.string()
    .min(1, 'New group name is required')
    .max(100, 'Group name is too long'),
  copySchedules: z.boolean().default(true),
  copyStudents: z.boolean().default(false),
})

export const assignStudentsSchema = z.object({
  studentIds: z.array(z.string().uuid('Invalid student ID')).min(1),
})

// Group Schedule Schemas
export const createGroupScheduleSchema = z.object({
  groupId: z.string().uuid('Invalid group ID'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
  dayOfWeek: dayOfWeekEnum,
  location: z.string().max(200).optional(),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
)

export const updateGroupScheduleSchema = z.object({
  startTime: z.string().datetime('Invalid start time format').optional(),
  endTime: z.string().datetime('Invalid end time format').optional(),
  dayOfWeek: dayOfWeekEnum.optional(),
  location: z.string().max(200).optional().nullable(),
}).refine(
  (data) => {
    if (data.startTime && data.endTime) {
      return new Date(data.endTime) > new Date(data.startTime)
    }
    return true
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
)

export const duplicateScheduleSchema = z.object({
  newDayOfWeek: dayOfWeekEnum.optional(),
  newStartTime: z.string().datetime().optional(),
  newEndTime: z.string().datetime().optional(),
})

// Type exports
export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>
export type DuplicateGroupInput = z.infer<typeof duplicateGroupSchema>
export type AssignStudentsInput = z.infer<typeof assignStudentsSchema>
export type CreateGroupScheduleInput = z.infer<typeof createGroupScheduleSchema>
export type UpdateGroupScheduleInput = z.infer<typeof updateGroupScheduleSchema>
export type DuplicateScheduleInput = z.infer<typeof duplicateScheduleSchema>
