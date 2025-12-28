import { z } from 'zod'

export const scheduleClassSchema = z.object({
  title: z.string().min(3, 'Class title must be at least 3 characters'),
  teacher: z.string().min(1, 'Please select a teacher'),
  room: z.string().min(1, 'Please select a room'),
  day: z.string().min(1, 'Please select a day'),
  type: z.enum(['group', 'private'], {
    message: 'Please select a class type',
  }),
  startTime: z.string().min(1, 'Please select a start time'),
  endTime: z.string().min(1, 'Please select an end time'),
  color: z.string().min(1, 'Please select a color'),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime
  }
  return true
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
})

export type ScheduleClassInput = z.infer<typeof scheduleClassSchema>
