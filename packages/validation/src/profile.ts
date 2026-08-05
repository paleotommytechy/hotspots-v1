import { z } from 'zod';

export const ProfileFormSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be under 50 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be under 30 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string().max(280, 'Bio must be under 280 characters').default(''),
  campus_id: z.string().min(1, 'Please select a campus'),
  department: z.string().min(2, 'Department is required').max(100),
  level: z.string().min(1, 'Level/Year is required'),
  avatar_url: z.string().url('Invalid photo URL').or(z.string().length(0)).default(''),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
