import { z, type ZodFormattedError } from 'zod';
import { LinkPriority } from '@prisma/client';

export const LinkAddSchema = z.object({
  id: z.string().uuid().optional(),
  url: z.string().url(),
  title: z.string().min(1).max(255).optional(),
  priority: z.nativeEnum(LinkPriority).optional(),
  isFavorite: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type LinkAddCommand = z.infer<typeof LinkAddSchema>;

export type LinkError = ZodFormattedError<LinkAddCommand>;
