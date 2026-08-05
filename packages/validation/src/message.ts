import { z } from 'zod';

export const SendMessageSchema = z.object({
  recipientId: z.string().uuid().or(z.string().min(1)),
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
});

export const ReportUserSchema = z.object({
  reportedUserId: z.string().min(1),
  reason: z.string().min(3, 'Please select or state a reason'),
  details: z.string().max(500).optional(),
});

export type SendMessageValues = z.infer<typeof SendMessageSchema>;
export type ReportUserValues = z.infer<typeof ReportUserSchema>;
