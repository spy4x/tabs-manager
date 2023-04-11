import { send, wsWrapper } from '../helpers';
import { prisma } from '../prisma';
import type { WebSocket } from 'ws';
import type { Context } from '../types';
import { TagAddSchema } from '../../shared/models/tag';

export async function tagRouter(
  ws: WebSocket,
  context: Context,
  type: string,
  data: any,
): Promise<void> {
  if (!context.userId) {
    return send(ws, { t: 'auth', data: 'Not authenticated' });
  }

  switch (type) {
    case 'tag/list': {
      return wsWrapper('tag/list', ws, async () => {
        const tags = await prisma.tag.findMany({
          where: { userId: context.userId },
          orderBy: { title: 'asc' },
        });
        send(ws, { t: 'tag/list', data: tags });
      });
    }
    case 'tag/link/list': {
      return wsWrapper('tag/link/list', ws, async () => {
        const tagLinks = await prisma.tagToLink.findMany({
          where: { userId: context.userId },
        });
        send(ws, { t: 'tag/link/list', data: tagLinks });
      });
    }
    case 'tag/add': {
      return wsWrapper('tag/add', ws, async () => {
        const tagAddCommand = TagAddSchema.parse(data);
        const tag = await prisma.tag.create({
          data: {
            ...tagAddCommand,
            userId: context.userId,
          },
        });
        send(ws, { t: 'tag/add/success', data: tag });
      });
    }
  }
}
