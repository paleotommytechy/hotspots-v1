import { z } from 'zod';

export const UserSelectionsSchema = z.object({
  interestIds: z.array(z.string()).min(1, 'Select at least 1 interest'),
  skillIds: z.array(z.string()).min(1, 'Select at least 1 skill'),
  goalIds: z.array(z.string()).min(1, 'Select at least 1 goal'),
});

export type UserSelectionsValues = z.infer<typeof UserSelectionsSchema>;
