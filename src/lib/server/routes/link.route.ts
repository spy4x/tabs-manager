import { send, wsWrapper } from '../helpers';
import { prisma } from '../prisma';
import type { WebSocket } from 'ws';
import type { Context } from '../types';
import { LinkAddSchema } from '../../shared/models/link';

export async function linkRouter(
  ws: WebSocket,
  context: Context,
  type: string,
  data: any,
): Promise<void> {
  if (!context.userId) {
    return send(ws, { t: 'auth', data: 'Not authenticated' });
  }

  switch (type) {
    case 'link/list': {
      return wsWrapper('link/list', ws, async () => {
        const links = await prisma.link.findMany({
          where: { userId: context.userId },
        });
        send(ws, { t: 'link/list', data: links });
      });
    }
    case 'link/add': {
      return wsWrapper('link/add', ws, async () => {
        const linkAddCommand = LinkAddSchema.parse(data);
        const link = await prisma.link.create({
          data: { ...linkAddCommand, userId: context.userId },
        });
        send(ws, { t: 'link/add/success', data: link });
      });
    }
  }
}
