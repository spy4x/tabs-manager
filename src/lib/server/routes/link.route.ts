import { send, wsWrapper } from '../helpers';
import { prisma } from '../prisma';
import type { WebSocket } from 'ws';
import type { Context } from '../types';
import { LinkAddSchema } from '../../shared/models/link';
import ogs from 'open-graph-scraper';

type OgObject = Awaited<ReturnType<typeof ogs>>['result'];

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
      return wsWrapper(type, ws, async () => {
        const links = await prisma.link.findMany({
          where: { userId: context.userId },
          orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        });
        send(ws, { t: type, data: links });
      });
    }
    case 'link/add': {
      return wsWrapper(type, ws, async () => {
        const linkAddCommand = LinkAddSchema.parse(data);
        const ogData = await getMetadata(linkAddCommand.url);

        const { tagIds, ...linkData } = linkAddCommand;

        const link = await prisma.link.create({
          data: {
            ...linkData,
            userId: context.userId,
            title: ogData ? ogData.ogTitle || ogData.twitterTitle : undefined,
            description: ogData ? ogData.ogDescription || ogData.twitterDescription : undefined,
            tags: {
              createMany: {
                data: tagIds.map((tagId) => ({
                  tagId,
                  userId: context.userId,
                })),
              },
            },
          },
          include: {
            tags: true,
          },
        });

        send(ws, { t: `${type}/success`, data: link });
      });
    }
  }
}

async function getMetadata(url: string): Promise<null | OgObject> {
  return null;
  // try {
  //   const res = await ogs({
  //     url,
  //     downloadLimit: 500000,
  //     // TODO: play with timeout to figure out what works best
  //     timeout: {
  //       request: 1000,
  //     },
  //   });
  //   if (!res.error) {
  //     console.log(res.result);
  //     return res.result;
  //   } else {
  //     return null;
  //   }
  // } catch (error: unknown) {
  //   console.log(error);
  //   return null;
  // }
}

// function extractImage(ogResult: OgObject) {
//   if (typeof ogImage === 'string') {
//     return ogImage;
//   }
//   if (Array.isArray(ogImage)) {
//     return ogImage.length > 0 ? ogImage[0].url : undefined;
//   }
//   return ogImage.url;
// }
