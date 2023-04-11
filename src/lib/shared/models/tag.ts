import { z, type ZodFormattedError } from 'zod';

export const TagAddSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(50),
  color: z.string().min(7).max(7),
  userId: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TagAddCommand = z.infer<typeof TagAddSchema>;

export type TagError = ZodFormattedError<TagAddCommand>;
