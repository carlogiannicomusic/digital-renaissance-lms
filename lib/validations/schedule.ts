import { z } from 'zod'

export const dayOfWeekEnum = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
])

export const createScheduleSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
  dayOfWeek: dayOfWeekEnum,
  location: z.string().optional(),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
)

export const updateScheduleSchema = z.object({
  id: z.string().uuid('Invalid schedule ID'),
  startTime: z.string().datetime('Invalid start time format').optional(),
  endTime: z.string().datetime('Invalid end time format').optional(),
  dayOfWeek: dayOfWeekEnum.optional(),
  location: z.string().optional(),
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

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>
