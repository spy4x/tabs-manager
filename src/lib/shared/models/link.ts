import { z, type ZodFormattedError } from 'zod';

export const LinkAddSchema = z.object({
  id: z.string().uuid().optional(),
  url: z.string().url(),
  title: z.string().min(1).max(255).optional(),
  priority: z.number().min(0).max(2).optional(),
  isFavorite: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type LinkAddCommand = z.infer<typeof LinkAddSchema>;

export type LinkError = ZodFormattedError<LinkAddCommand>;
