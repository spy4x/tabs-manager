import { send, wsWrapper } from '../helpers';
import { prisma } from '../prisma';
import type { WebSocket } from 'ws';
import type { Context } from '../types';
import { LinkAddSchema } from '../../shared/models/link';
import ogs from 'open-graph-scraper';

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
        // placeholder for parsing OG data
        const ogData = await ogs({
          url: linkAddCommand.url,
          downloadLimit: 5000000,
          // play with timeout to figure out what works best
          // timeout: {
          //   request: 1000,
          // },
        });
        console.log(ogData.result);
        const link = await prisma.link.create({
          data: {
            ...linkAddCommand,
            userId: context.userId,
            title: ogData.result.ogTitle || ogData.result.twitterTitle,
            description: ogData.result.ogDescription || ogData.result.twitterDescription,

            // image: ogData.result.ogImage
            //   ? typeof ogData.result.ogImage === 'string'
            //     ? ogData.result.ogImage
            //     : Array.isArray(ogData.result.ogImage)
            //     ? ogData.result.ogImage.length > 0
            //       ? ogData.result.ogImage[0].url
            //       : undefined
            //     : ogData.result.ogImage.url
            //   : ogData.result.twitterImage?.url,
          },
        });
        send(ws, { t: 'link/add/success', data: link });
      });
    }
  }
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
